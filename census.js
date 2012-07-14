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

// Setup code to run in a function for easy exit (return) etc.
function main() {
  // Use either the user's selected region or 'world' based on argv[1]
  var selectWorld = argv[1] == 'world';

  // Get region if we'll need it
  var region = selectWorld ? 0 : context.getSession().getRegion();

  // Get player's origin
  var origin = player.getBlockIn();

  // List of villagers and professions we found
  var villagers = new Array();
  var professions = new Array();

  // Get a list of all known living entities (inactive areas don't seem to count)
  // NOTE: Need to call getWorld twice to get object that supports getLivingEntities
  var entities = player.getWorld().getWorld().getLivingEntities();

  // Walk through the livingEntities and select villagers
  var count=0;
  for (var i=0; i < entities.size(); i++) {
    // Get the entity, location and a vector object
    var e = entities.get(i);
    var eloc = e.getLocation();
    var vec = new Vector(eloc.getX(), eloc.getY(), eloc.getZ());

    // Might be a better way but for now we match the string
    if (e.getType() == "VILLAGER") {
      // Are we interested in this one?
      if (selectWorld || vec.containedWithin(region.getMinimumPoint(), region.getMaximumPoint())) {
	// Count professions
	var p = e.getProfession();
	if (p in professions)
	  professions[p] += 1;
	else
	  professions[p] = 1;

	// Save to the list
	villagers[count++] = { entity: e, distance: origin.distance(vec), vector: vec, profession: p };
      }
    }
  }

  // Notify the user if we didn't find any villagers
  if (villagers.length == 0) {
    player.printError("No villagers found in the selected region!");
    player.printError("Expand your selection or try: /" + argv[0] + " world");

    // Nothing more to do
    return;
  }

  // Print title based on selection
  context.print("\n" + (selectWorld ? "Worldwide" : "Regional") + " Villager Census:");

  // Sort by distance from the player
  villagers.sort(function(a, b) { return a.distance - b.distance; });

  // Print out table of villagers
  for (var i=0; i < villagers.length; i++) {
    var v = villagers[i];

    context.print((i+1).toString() + ") "
      + v.profession
      + " " + v.distance.toFixed(2).toString()
      + 'm @ ' + v.vector.getX().toFixed(2).toString()
      + ', ' + v.vector.getY().toFixed(2).toString()
      + ', ' + v.vector.getZ().toFixed(2).toString()
    );
  }

  // List professions and counts
  context.print("\nProfession Summary:");
  for (p in professions) {
    context.print('  ' + professions[p] + ' ' + p + (professions[p] == 1 ? '' : 'S'));
  }

  return;
}

// Run the actual script
main();
