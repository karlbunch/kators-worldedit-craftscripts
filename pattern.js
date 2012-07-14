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

var usage = "[h] [=blk1[,blk2,...]] <block1> [#x]<block2> [<block3> ... <blockN>]\n"
	  + "Block can be `skip` to skip a location in the pattern.\n"
          + "Optional args:\n"
          + " h - horizontal bias to pattern.\n"
          + " =[blk1[,blk2,...] - only replace blocks of blk1...\n"
          + " #x - repeat factor for a block.\n";

context.checkArgs(1, -1, usage + "\n /" + argv[0] + " help - for more help.\n");

// Setup code to run in a function for easy exit (return) etc.
function main() {
  // Setup vars
  var blocks = context.remember();
  var session = context.getSession();
  var region = session.getRegion();
  var pattern = new Array;
  var replace = new Array;
  var bias = 'v';
  var reRepeat = /([\d+])[x#](.*)/i;
  var reReplace = /^=(.*)/;

  // Handle help request
  if(argv[1] == 'help')
    return help();

  // Check args for flag(s)
  var i = 1;
  for(;i < argv.length;i++)
    if (argv[i] == 'h') {
      bias = 'h';
    } else if((m = reReplace(argv[i])) != null) {
      var blks = m[1].split(',');

      for(var j = 0;j < blks.length;j++) {
        replace[replace.length] = context.getBlock(blks[j]);
      }
    } else
      break;

  // Rest of args are blocks
  for(var repeat = 1;i < argv.length;i++) {
    var block = argv[i];

    // Did they include a repeat factor?
    if ((m = reRepeat.exec(block)) != null) {
      // Extract repeat and optional block name
      repeat = m[1];
      block = m[2];

      // If there is no block name then just loop to next arg
      if (block == '')
        continue;
    }

    // Inject these blocks with optional repeat
    while(repeat-- > 0)
      pattern[pattern.length] = (block == '+' || block == 'skip') ? '+' : context.getBlock(block);

    // Reset to defalut repeat of 1
    repeat = 1;
  }

  var s = 'Replace: ';
  for(var k = 0;k < replace.length;k++) {
    s += replace[k].getType() + " ";
  }
  player.print(s);
  var s = 'Pattern: ';
  for(var k = 0;k < pattern.length;k++) {
    s += " " + (pattern[k] == '+' ? "<skip>" : pattern[k].getType());
  }
  player.print(s);

  // Walk the region and set blocks to the pattern
  var i = 0;
  var origin = region.getMinimumPoint();

  if(bias == 'v') {
    // Vertical bias
    for(var h = 0;h < region.getHeight();h++) {
      for(var l = 0;l < region.getLength();l++) {
	for(var w = 0;w < region.getWidth();w++) {
	  replaceBlock(blocks, origin.add(w, h, l), pattern[i++], replace);
	  i %= pattern.length;
	}
      }
    }
  } else {
    // Horizontal bias
    for(var l = 0;l < region.getLength();l++) {
      for(var w = 0;w < region.getWidth();w++) {
        for(var h = 0;h < region.getHeight();h++) {
	  replaceBlock(blocks, origin.add(w, h, l), pattern[i++], replace);
	  i %= pattern.length;
	}
      }
    }
  }

  return;
}

function replaceBlock(blocks, pt, blkId, replace) {
  // Skip this block if user asked to skip in the pattern
  if(blkId == '+')
    return;

  // If no replace blocks were passed then just always set the block
  if(replace.length == 0)
    return blocks.setBlock(pt, blkId);

  // get the current block at this pt
  var b = blocks.getBlock(pt);

  // If it's in the list replace it...
  for(var k = 0;k < replace.length;k++)
    if(b.getType() == replace[k].getType())
      return blocks.setBlock(pt, blkId);

  return false;
}

function help() {
  var cmd = '/' + argv[0];

  context.print("Usage: " + cmd + " " + usage + "\n"
    + "Use " + cmd + " to create a pattern in the selected region.\n"
    + "You can specify a list of blocks for the pattern.\n"
    + "#xBlockid - optional repeat factor.\n"
    + "`skip` - skip changes to blocks at that point in the pattern.\n"
    + "={block list} - Restrict changes to only matching blocks.\n"
    + "\n"
    + "Examples:\n"
    + " " + cmd + " red 3x green - 1 red, 3 green\n"
    + " " + cmd + " 2xstone 4x air 3#wood - 2 stone, 4 air, 3 wood\n"
    + " " + cmd + " =0,8,9 stonebrick 4x skip - Replace 0,8,9\n"
    + "           with stonebrick skipping 4 bricks between each.\n"
 );

 return;
}

// Run the actual script
main();
