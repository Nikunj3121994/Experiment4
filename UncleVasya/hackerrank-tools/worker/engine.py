#!/usr/bin/env python
from __future__ import print_function
import time
import traceback
import os
import random
import sys
import json
import io
if sys.version_info >= (3,):
    def unicode(s):
        return s

from sandbox import get_sandbox

class HeadTail(object):
    'Capture first part of file write and discard remainder'
    def __init__(self, file, max_capture=510):
        self.file = file
        self.max_capture = max_capture
        self.capture_head_len = 0
        self.capture_head = unicode('')
        self.capture_tail = unicode('')
    def write(self, data):
        if self.file:
            self.file.write(data)
        capture_head_left = self.max_capture - self.capture_head_len
        if capture_head_left > 0:
            data_len = len(data)
            if data_len <= capture_head_left:
                self.capture_head += data
                self.capture_head_len += data_len
            else:
                self.capture_head += data[:capture_head_left]
                self.capture_head_len = self.max_capture
                self.capture_tail += data[capture_head_left:]
                self.capture_tail = self.capture_tail[-self.max_capture:]
        else:
            self.capture_tail += data
            self.capture_tail = self.capture_tail[-self.max_capture:]
    def flush(self):
        if self.file:
            self.file.flush()
    def close(self):
        if self.file:
            self.file.close()
    def head(self):
        return self.capture_head
    def tail(self):
        return self.capture_tail
    def headtail(self):
        if self.capture_head != '' and self.capture_tail != '':
            sep = unicode('\n..\n')
        else:
            sep = unicode('')
        return self.capture_head + sep + self.capture_tail

def run_game(game, botcmds, options):
    # file descriptors for replay and streaming formats
    replay_log = options.get('replay_log', None)
    stream_log = options.get('stream_log', None)
    verbose_log = options.get('verbose_log', None)
    # file descriptors for bots, should be list matching # of bots
    input_logs = options.get('input_logs', [None]*len(botcmds))
    output_logs = options.get('output_logs', [None]*len(botcmds))
    error_logs = options.get('error_logs', [None]*len(botcmds))

    capture_errors = options.get('capture_errors', False)
    capture_errors_max = options.get('capture_errors_max', 510)

    turns = int(options['turns'])
    loadtime = float(options['loadtime']) / 1000
    turntime = float(options['turntime']) / 1000
    strict = options.get('strict', False)
    end_wait = options.get('end_wait', 0.0)

    location = options.get('location', 'localhost')
    game_id = options.get('game_id', 0)

    error = ''

    bots = []
    bot_status = []
    bot_turns = []
    if capture_errors:
        error_logs = [HeadTail(log, capture_errors_max) for log in error_logs]
    try:
        # create bot sandboxes
        work_dirs, cmds = zip(*botcmds)
        for dir in work_dirs:
            sandbox = get_sandbox(dir,
                    secure=options.get('secure_jail', None)) 
            bots.append(sandbox)
            bot_status.append('survived')
            bot_turns.append(0)

        if stream_log:
            stream_log.write(game.get_player_start())
            stream_log.flush()

        if verbose_log:
            verbose_log.write('\n\n')
            verbose_log.write('running for %s turns \n\n' % turns)
        game.start_game()
        for turn in range(1, turns+1):
            # send game state to each player
            for b, bot in enumerate(bots):
                if game.is_alive(b) and game.is_his_turn(b):
                    bot_cmd = cmds[b]
                    bot.start(bot_cmd)
                    # bot.pause()
                    # ensure it started
                    if not bot.is_alive:
                        game.kill_player(b)
                    
                    state = game.get_player_state(b)
                    bot.write(state)
                    bot.close_stdin()
                    if input_logs and input_logs[b]:
                        input_logs[b].write(state)
                        input_logs[b].flush()
                    bot_turns[b] = turn

            if stream_log:
                stream_log.write('turn %s\n' % turn)
                stream_log.write('score %s\n' % ' '.join([str(s) for s in game.get_scores()]))
                stream_log.write(game.get_state())
                stream_log.flush()
            game.start_turn()

            # get moves from each player
            if options.get('serial', False):
                simul_num = int(options['serial']) # int(True) is 1
            else:
                simul_num = len(bots)

            bot_moves = [[] for b in bots]
            error_lines = [[] for b in bots]
            statuses = [None for b in bots]
            bot_list = [(b, bot) for b, bot in enumerate(bots)
                        if game.is_alive(b) and game.is_his_turn(b)]
            random.shuffle(bot_list)
            for group_num in range(0, len(bot_list), simul_num):
                pnums, pbots = zip(*bot_list[group_num:group_num + simul_num])
                moves, errors, status = get_moves(game, pbots, pnums,
                        turntime, turn)
                for p, b in enumerate(pnums):
                    bot_moves[b] = moves[p]
                    error_lines[b] = errors[p]
                    statuses[b] = status[p]

            # handle any logs that get_moves produced
            for b, errors in enumerate(error_lines):
                if errors:
                    if error_logs and error_logs[b]:
                        error_logs[b].write(unicode('\n').join(errors)+unicode('\n'))
            # set status for timeouts and crashes
            for b, status in enumerate(statuses):
                if status != None:
                    bot_status[b] = status
                    bot_turns[b] = turn

            # process all moves
            bot_alive = [game.is_alive(b) for b in range(len(bots))]
            if not game.game_over():
                for b, moves in enumerate(bot_moves):
                    if game.is_alive(b):
                        valid, ignored, invalid = game.do_moves(b, moves)
                        if output_logs and output_logs[b]:
                            output_logs[b].write('# turn %s\n' % turn)
                            if valid:
                                if output_logs and output_logs[b]:
                                    output_logs[b].write('\n'.join(valid)+'\n')
                                    output_logs[b].flush()
                        if ignored:
                            if error_logs and error_logs[b]:
                                error_logs[b].write('turn %4d bot %s ignored actions:\n' % (turn, b))
                                error_logs[b].write('\n'.join(ignored)+'\n')
                                error_logs[b].flush()
                            if output_logs and output_logs[b]:
                                output_logs[b].write('\n'.join(ignored)+'\n')
                                output_logs[b].flush()
                        if invalid:
                            if strict:
                                game.kill_player(b)
                                bot_status[b] = 'invalid'
                                bot_turns[b] = turn
                            if error_logs and error_logs[b]:
                                error_logs[b].write('turn %4d bot %s invalid actions:\n' % (turn, b))
                                error_logs[b].write('\n'.join(invalid)+'\n')
                                error_logs[b].flush()
                            if output_logs and output_logs[b]:
                                output_logs[b].write('\n'.join(invalid)+'\n')
                                output_logs[b].flush()
            game.finish_turn()

            if verbose_log:
                stats = game.get_stats()
                stat_keys = sorted(stats.keys())
                s = 'turn %4d stats: ' % turn
                if turn % 10 == 0:
                    verbose_log.write(' '*len(s))
                    for key in stat_keys:
                        values = stats[key]
                        verbose_log.write(' {0:^{1}}'.format(key, max(len(key), len(str(values)))))
                    verbose_log.write('\n')
                verbose_log.write(s)
                for key in stat_keys:
                    values = stats[key]
                    if type(values) == list:
                        values = '[' + ','.join(map(str,values)) + ']'
                    verbose_log.write(' {0:^{1}}'.format(values, max(len(key), len(str(values)))))
                verbose_log.write('\n')

            if game.game_over():
                break

        # send bots final state and score, output to replay file
        game.finish_game()
        score_line ='score %s\n' % ' '.join(map(str, game.get_scores()))
        status_line = 'status %s\n' % ' '.join(bot_status)
        status_line += 'playerturns %s\n' % ' '.join(map(str, bot_turns))
        end_line = 'end\nplayers %s\n' % len(bots) + score_line + status_line
        if stream_log:
            stream_log.write(end_line)
            stream_log.write(game.get_state())
            stream_log.flush()
        if verbose_log:
            verbose_log.write(score_line)
            verbose_log.write(status_line)
            verbose_log.flush()
    except Exception as e:
        # TODO: sanitize error output, tracebacks shouldn't be sent to workers
        error = traceback.format_exc()
        if verbose_log:
            verbose_log.write(traceback.format_exc())
        # error = str(e)

    if error:
        game_result = { 'error': error }
    else:
        scores = game.get_scores()
        game_result = {
            'challenge': game.__class__.__name__.lower(),
            'location': location,
            'game_id': game_id,
            'status': bot_status,
            'playerturns': bot_turns,
            'score': scores,
            'rank': [sorted(scores, reverse=True).index(x) for x in scores],
            'replayformat': 'json',
            'replaydata': game.get_replay(),
            'game_length': turn
        }
        if capture_errors:
            game_result['errors'] = [head.headtail() for head in error_logs]

    if replay_log:
        ### monkey patch to limit float presicion to 3 digits ;(
        from json import encoder
        encoder.FLOAT_REPR = lambda o: format(o, '.3f')
        
        json.dump(game_result, replay_log, sort_keys=True)

    return game_result

def get_moves(game, bots, bot_nums, time_limit, turn):
    bot_finished = [not game.is_alive(bot_nums[b]) for b in range(len(bots))]
    bot_moves = [[] for b in bots]
    error_lines = [[] for b in bots]
    statuses = [None for b in bots]
    
    for bot in bots:
        bot.resume()
    # don't start timing until the bots are started
    start_time = time.time()

    # loop until time is up
    while time.time() - start_time < time_limit:
        # break if all bots sent moves or are dead
        bots_alive = sum([1 for bot in bots if bot.is_alive]) 
        if bots_alive <= 0 or sum(bot_finished) >= len(bots):
            break
        
        time.sleep(0.01)
        for b, bot in enumerate(bots):
            if bot_finished[b] or not bot.is_alive:
                continue # already got bot moves or bot is dead

            # read a maximum of 100 lines per iteration
            for x in range(100):
                line = bot.read_line()
                if line is None:
                    # stil waiting for more data
                    break
                line = line.strip()
                bot_moves[b].append(line)
                if len(bot_moves) >= game.get_moves_limit(b):
                    bot_finished[b] = True
                    # bot finished sending data for this turn
                    break

            for x in range(100):
                line = bot.read_error()
                if line is None:
                    break
                error_lines[b].append(line)
    
    # pause all bots again
    for bot in bots:
        if bot.is_alive:
            bot.pause()

    # check for any final output from bots
    for b, bot in enumerate(bots):     
        line = bot.read_line()
        if not bot_finished[b]:
            while line is not None and len(bot_moves[b]) < 40000:
                line = line.strip()
                if not bot_finished[b]:
                    bot_moves[b].append(line)
                    if len(bot_moves) >= game.get_moves_limit(b):
                        bot_finished[b] = True
                line = bot.read_line()

        line = bot.read_error()
        while line is not None and len(error_lines[b]) < 1000:
            error_lines[b].append(line)
            line = bot.read_error()
            
        if not bot.is_alive and not bot_finished[b]:
            error_lines[b].append(unicode('turn %4d bot %s crashed') % (turn, bot_nums[b]))
            statuses[b] = 'crashed'
            line = bot.read_error()
            while line != None:
                error_lines[b].append(line)
                line = bot.read_error()
            bot_finished[b] = True
            game.kill_player(bot_nums[b])
            continue # bot is dead

    # kill bots and check for timed-out
    for b, finished in enumerate(bot_finished):
        if not finished:
            error_lines[b].append(unicode('turn %4d bot %s timed out') % (turn, bot_nums[b]))
            statuses[b] = 'timeout'
            bot = bots[b]
            for x in range(100):
                line = bot.read_error()
                if line is None:
                    break
                error_lines[b].append(line)
            game.kill_player(bot_nums[b])
        bots[b].kill()

    return bot_moves, error_lines, statuses
