/*
 * Copyright (c) 2012 Karl Bunch <http://www.karlbunch.com/>
 *  
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *      
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU General Public License for more details.
 *      
 * You should have received a copy of the GNU General Public License
 * along with this program. If not, see <http://www.gnu.org/licenses/>.
 */  

importPackage(Packages.com.sk89q.worldedit);

var usage = "### command[;command;command;...]"
          + " ### = Number of times to run the commands.\n";

context.checkArgs(1, -1, usage + "\n /" + argv[0] + " help - for more help.\n");

// Setup code to run in a function for easy exit (return) etc.
function main() {
  if(argv[1] == "help")
    return help();

  var target = WorldEdit.getInstance().getServer().matchPlayer(player).getPlayer();
  var repeat = parseInt(argv[1]);
  var cmds = argv.slice(2).join(' ').split(';');
  var reCraftscript = /^\S+\.js\s/;

  // Run the commands
  while(repeat > 0) {
    // Walk through each command
    for(var i = 0;i < cmds.length;i++) {
      // Remove any leading or trailing spaces
      var cmd = cmds[i].replace(/^\s+|\s+$/g,"").replace(/^\//, "");

      // If there is still a command to run send it to the client..
      if(cmd != '') {
	// Craftscript.js ... needs to be cs Craftscript.js ...
	if(reCraftscript.exec(cmd))
	  cmd = 'cs ' + cmd;

        player.print(repeat + ") " + cmd + "\n");
        target.performCommand(cmd);
      }
    }
    repeat--;
  }

  return;
}

function help() {
  var cmd = '/' + argv[0];

  context.print("Usage: " + cmd + " " + usage + "\n"
    + "Use " + cmd + " to repeat commands in sequence.\n"
    + "Each command is seperated by a semicolon `;` (Shift-Colon)\n"
    + "\n"
    + "Examples:\n"
    + " " + cmd + " 3 /say Hello;/say goodbye;\n"
    + " " + cmd + " 10 //move 1 n;//shift 1 n;//move 1 e;//shift 1 e\n"
 );

 return;
}

// Run the actual script
main();
