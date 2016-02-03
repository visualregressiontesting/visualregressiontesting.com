'use strict';
var yeoman = require('yeoman-generator');
var chalk = require('chalk');
var yosay = require('yosay');

module.exports = yeoman.generators.Base.extend({
  prompting: function () {
    var done = this.async();

    // Have Yeoman greet the user.
    this.log(yosay(
      'Welcome to the super ' + chalk.red('Visualregressiontesting') + ' generator!'
    ));

    var prompts = [
      {
        type: 'list',
        name: 'type',
        message: 'What category does this belong to?',
        choices: ['blogs', 'books', 'podcasts', 'talks', 'tools', 'videos']
      },
      {
        type: 'input',
        name: 'url',
        message: 'Full URL',
      },
      {
        type: 'input',
        name: 'title',
        message: 'Title',
      },
      {
        type: 'input',
        name: 'description',
        message: 'Description',
      },
    ];

    this.prompt(prompts, function (props) {
      this.props = props;
      // To access props later use this.props.someOption;

      done();
    }.bind(this));
  },

  writing: {
    app: function () {

      this.props.name_underscore = this.props.title.replace(/ /g,"_").replace(/-/g,"_").toLowerCase();

      this.fs.copyTpl(
        this.templatePath('_base.md'),
        this.destinationPath('src/content/' + this.props.type + '/' + this.props.name_underscore + '.md'),
        {props: this.props}
      );
    }
  },

  install: function () {

  }
});
