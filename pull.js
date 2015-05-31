/*
 * Copyright (c) 2015 Karl Bunch
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
importPackage(Packages.com.sk89q.worldedit);
importPackage(Packages.java.util.logging);

var logPrefix = "pull.js>> ";

var logger = Logger.getLogger("Minecraft");

var cmd = context.getConfiguration().getWorkingDirectory() + "/" + context.getConfiguration().scriptsDir + "/git-pull.sh";

logger.info(logPrefix + "Running " + cmd);

context.print("Running " + cmd);

var pb = java.lang.ProcessBuilder(java.lang.System.getProperty("user.dir") + "/" + cmd).redirectErrorStream(true).start();

var br = new BufferedReader(new InputStreamReader(pb.getInputStream()));

while ((line = br.readLine()) != null) {
    logger.info(logPrefix + line);
    context.print(">> " + line);
}

pb.waitFor();

context.print("Finished");
