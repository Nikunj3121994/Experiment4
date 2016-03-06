# Hydrosolutions iMomo
Hydrosolutions official repository for the iMomo project

[![devDependency Status](https://david-dm.org/hydrosolutions/imomo-hydromet-client/dev-status.svg)](https://david-dm.org/hydrosolutions/imomo-hydromet-client#info=devDependencies)

## Technologies

### Client-side

* [AngularJS](https://angularjs.org/) - Main framework
* [Angular-UI router](http://angular-ui.github.io/ui-router/site/#/api/ui.router) - State machine framework
* [D3js](http://d3js.org/) - Visualizations and Graphics
* [Jade](http://jade-lang.com/) - HTML templating
* [Bower](http://bower.io/) - Client package manager
* [Grunt](http://gruntjs.com/) - Client build automation
* [LESS](http://lesscss.org/) - CSS compiler
* [YAML](http://www.yaml.org/) - Locale configuration
* [Karma](http://karma-runner.github.io/0.12/index.html) - Client testing

### Server-side

* [CherryPy](http://cherrypy.readthedocs.org/en/latest/) - Main HTTP framework
* [SQLAlchemy](http://www.sqlalchemy.org/) - ORM
* [PostgreSQL](http://www.postgresql.org/docs/9.3/static/index.html) - RDBMS

### Deployment - Amazon AWS

* HTML, JS, CSS (Compiled) is static files in S3 (Storage service)
* Application Server (Python) is in ElasticBeanstalk
* Database is in RDS
