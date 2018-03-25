'use babel';

import { exec } from 'child_process';
import { CompositeDisposable } from 'atom';
import { BufferedProcess } from 'atom';

export default {

  activate(state) {
    this.subscriptions = new CompositeDisposable();

    // Register command that toggles this view
    this.subscriptions.add(atom.commands.add('atom-workspace', {
      'atom-reruby:rename-class': () => this.renameClass()
    }));
  },

  deactivate() {
    this.subscriptions.dispose();
  },

  renameClass() {
    const rerubyLocation = this.currentRerubyLocation();
    const className = 'NewClassName';

    this.runReruby('rename_const', rerubyLocation, className)
  },

  currentRerubyLocation() {
    const editor = atom.workspace.getActiveTextEditor();

    const path = this.projectRelativePath(editor);
    const range = editor.getSelectedBufferRange();

    const rerubyRange = `${this.toRerubyPosition(range.start)}:${this.toRerubyPosition(range.end)}`;

    return `${path}:${rerubyRange}`
  },

  projectRelativePath(editor) {
    const path = editor.getPath();

    return atom.project.relativizePath(path)[1];
  },

  toRerubyPosition(position) {
    return `${position.row+1}:${position.column}`
  },

  runReruby(subcommand, location, params) {
    const command = 'reruby'
    const args = [subcommand, '-l', location].concat(params);
    const stdout = (output) => console.log(output)
    const exit = (code) => console.log("Something went wrong")

    new BufferedProcess({command, args, stdout, exit})
  }


};
