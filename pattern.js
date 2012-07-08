// $Id$
/*
 * Copyright (c) 2012 Karl Bunch
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

context.checkArgs(1, -1, "[h] <block1> <block2> [<block3> ... <blockN>]\n  h = (optional) Horizontal bias to pattern.");

// Setup code to run in a function for easy exit (return) etc.
function main() {
  // Setup vars
  var blocks = context.remember();
  var session = context.getSession();
  var region = session.getRegion();
  var pattern = new Array;
  var bias = 'v';

  // Check args for flag
  var i = 1;
  if (argv[i] == 'h') {
    i++;
    bias = 'h';
  }

  // Rest of args are blocks
  for(;i < argv.length;i++) {
    pattern[pattern.length] = context.getBlock(argv[i]);
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

// Run the actual script
main();
