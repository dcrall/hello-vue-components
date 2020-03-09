const fs = require('fs')
const path = require('path')

// Taken from: https://gist.github.com/kethinov/6658166
const walkSync = (dir, filelist = []) => {
    fs.readdirSync(dir).forEach(file => {

        filelist = fs.statSync(path.join(dir, file)).isDirectory()
            ? walkSync(path.join(dir, file), filelist)
            : filelist.concat(path.join(dir, file));

    });
    return filelist;
}

// Save the build dir
let buildDir = __dirname
let src = path.resolve(__dirname, '../src')

// Switch to the src directory, so we can build relative imports
// e.g. sub/HelloD
process.chdir(src)

// Get all the .vue files under the src directory
let components = walkSync('.').filter(f => /\.vue$/.test(f))

// Restore cwd to the build dir
process.chdir(buildDir)

// Get the names of the components from the file names
// Return an array of the form:
// [ 'HelloA', 'HelloB', 'HelloC', 'sub/HelloD' ]
components = components.map(f => f.replace(/\.\w+$/, ''))

/**
 * Capture both the path and component name
 * [
 *    { path: 'HelloA', name: 'HelloA' },
 *    { path: 'HelloB', name: 'HelloB' },
 *    { path: 'HelloC', name: 'HelloC' },
 *    { path: 'sub/HelloD', name: 'HelloD' }
 * ]
 */
components = components.map(f => {
    let componentPath = f;
    let name = path.parse(f).name;
    return { path: componentPath, name }
})

console.log(components)

module.exports = components
