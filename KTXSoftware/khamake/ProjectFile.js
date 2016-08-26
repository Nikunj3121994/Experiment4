"use strict";
var fs = require('fs');
module.exports = function (from) {
    var project = JSON.parse(fs.readFileSync(from.resolve('project.kha').toString(), { encoding: 'utf8' }));
    if (project.format < 2) {
        var assets = {};
        for (var _i = 0, _a = project.assets; _i < _a.length; _i++) {
            var asset = _a[_i];
            assets[asset.id] = asset;
            delete asset.id;
        }
        var rooms = {};
        for (var _b = 0, _c = project.rooms; _b < _c.length; _b++) {
            var room = _c[_b];
            rooms[room.id] = room;
            delete room.id;
            for (var a in room.assets) {
                room.assets[a] = assets[room.assets[a]].name;
            }
        }
        for (var _d = 0, _e = project.rooms; _d < _e.length; _d++) {
            var room = _e[_d];
            if (room.parent) {
                room.parent = rooms[room.parent].name;
            }
            else {
                room.parent = null;
            }
            for (var n in room.neighbours) {
                room.neighbours[n] = rooms[room.neighbours[n]].name;
            }
        }
        project.format = 2;
        fs.writeFileSync(from.resolve('project.kha').toString(), JSON.stringify(project, null, '\t'), { encoding: 'utf8' });
    }
    if (project.format < 3) {
        for (var _f = 0, _g = project.assets; _f < _g.length; _f++) {
            var asset = _g[_f];
            if (asset.type === 'music' || asset.type === 'sound') {
                asset.file += '.wav';
            }
        }
        project.format = 3;
        fs.writeFileSync(from.resolve('project.kha').toString(), JSON.stringify(project, null, '\t'), { encoding: 'utf8' });
    }
    return project;
};
