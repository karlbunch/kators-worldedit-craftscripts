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
importPackage(Packages.com.sk89q.worldedit.blocks);

var usage = "[h] <block1> [#x]<block2> [<block3> ... <blockN>]\n"
          + " h = (optional) horizontal bias to pattern.\n"
          + " #x = (optional) repeat factor for a block.\n";

context.checkArgs(1, -1, usage + "\n /" + argv[0] + " help - for more help.\n");

// Setup code to run in a function for easy exit (return) etc.
function main() {
  // Setup vars
  var blocks = context.remember();
  var session = context.getSession();
  var region = session.getRegion();
  var pattern = new Array;
  var bias = 'v';
  var reRepeat = /([\d+])[x#](.*)/i;

  // Handle help request
  if(argv[1] == 'help')
    return help();

  // Check args for flag
  var i = 1;
  if (argv[i] == 'h') {
    i++;
    bias = 'h';
  }

  // Default repeat is 1
  var repeat = 1;

  // Rest of args are blocks
  for(;i < argv.length;i++) {
    var block = argv[i];

    // Did they include a repeat factor?
    if((m = reRepeat.exec(block)) != null) {
      // Extract repeat and optional block name
      repeat = m[1];
      block = m[2];

      // If there is no block name then just loop to next arg
      if(block == '')
        continue;
    }

    // Inject these blocks with optional repeat
    while(repeat-- > 0)
      pattern[pattern.length] = context.getBlock(block);

    // Reset to defalut repeat of 1
    repeat = 1;
  }

  // Walk the region and set blocks to the pattern
  var i = 0;
  var origin = region.getMinimumPoint();

  if(bias == 'v') {
    // Vertical bias
    for(var h = 0;h < region.getHeight();h++) {
      for(var l = 0;l < region.getLength();l++) {
	for(var w = 0;w < region.getWidth();w++) {
	  blocks.setBlock(origin.add(w, h, l), pattern[i++]);
	  i %= pattern.length;
	}
      }
    }
  } else {
    // Horizontal bias
    for(var l = 0;l < region.getLength();l++) {
      for(var w = 0;w < region.getWidth();w++) {
        for(var h = 0;h < region.getHeight();h++) {
	  blocks.setBlock(origin.add(w, h, l), pattern[i++]);
	  i %= pattern.length;
	}
      }
    }
  }

  return;
}

function help() {
  var cmd = '/' + argv[0];

  context.print("Usage: " + cmd + " " + usage + "\n"
    + "Use " + cmd + " to create a pattern in the selected region.\n"
    + "You can specify a list of blocks for the pattern.\n"
    + "Each block can have an optional repeat factor.\n"
    + "\n"
    + "Examples:\n"
    + " " + cmd + " red 3x green - 1 red, 3 green blocks\n"
    + " " + cmd + " 2xstone 4x air 3#wood - 2 stone, 4 air, 3 wood blocks \n"
 );

 return;
}

// Run the actual script
main();
