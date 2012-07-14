// $Id$
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

importPackage(Packages.java.io);
importPackage(Packages.java.awt);
importPackage(Packages.com.sk89q.worldedit);
importPackage(Packages.com.sk89q.worldedit.localworld);

context.checkArgs(1, -1, "same as //move just does //move and then //shift to keep selection with object.");

// Setup code to run in a function for easy exit (return) etc.
function main() {
  var target = player.getPlayer();
  var cmds = argv.slice(1).join(' ').split('/');

  // Walk through each command
  for(var i = 0;i < cmds.length;i++) {
    // Remove any leading or trailing spaces
    var cmd = cmds[i].replace(/^\s+|\s+$/g,"");

    player.print("[" + cmd + "]\n");
    target.performCommand("/move " + cmd);
    target.performCommand("/shift " + cmd);
  }

  return;
}

// Run the actual script
main();
