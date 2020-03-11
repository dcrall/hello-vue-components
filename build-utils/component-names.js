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
};

/**
 *  - Collect all files under the ../src directory
 *  - Filter down to just the .vue files
 *  - Parse the paths, so we can clean up the data
 *  - Build response object with path & name attributes
 *  - Clean up the path attribute
 */
let components =
    walkSync('../src').filter(f => /\.vue$/.test(f)).map(f => path.parse(f)).map(f => {
        return {
            name: f.name,
            path: f.dir
        }
    }).map(f => {
        f.path = f.path.replace('../src', '');
        // remove any leading slashes
        f.path = f.path.replace(/^\//gi, '');

        if(f.path !== '') f.path = f.path + '/';
        f.path = f.path + f.name;
        return f;
    });


console.log(components);

// Export the component description objects
module.exports = components;


/**
 * For future reference, here are the individual steps of the transformation
 * after we gather all of the components under the /src directory
 *
 * // Filter out all the vue components
 * walkSync('../src').filter(f => /\.vue$/.test(f))
 *
 * [
 *     '../src/HelloA.vue',
 *     '../src/HelloB.vue',
 *     '../src/HelloC.vue',
 *     '../src/sub/HelloD.vue'
 *     ]
 *
 *
 * // Parse the paths for the vue components
 * walkSync('../src').filter(f => /\.vue$/.test(f)).map(f => path.parse(f))
 *
 * [
 *    {
 *        root: '',
 *        dir: '../src',
 *        base: 'HelloA.vue',
 *        ext: '.vue',
 *        name: 'HelloA'
 *    },
 *    {
 *        root: '',
 *        dir: '../src',
 *        base: 'HelloB.vue',
 *        ext: '.vue',
 *        name: 'HelloB'
 *    },
 *    {
 *        root: '',
 *        dir: '../src',
 *        base: 'HelloC.vue',
 *        ext: '.vue',
 *        name: 'HelloC'
 *    },
 *    {
 *        root: '',
 *        dir: '../src/sub',
 *        base: 'HelloD.vue',
 *        ext: '.vue',
 *        name: 'HelloD'
 *    }
 *  ]
 *
 *
 *  // Simplify the results to an object of the form:
 *  // {name: 'CompnentName', path: ''}
 *    [
 *      { name: 'HelloA', path: '../src' },
 *      { name: 'HelloB', path: '../src' },
 *      { name: 'HelloC', path: '../src' },
 *      { name: 'HelloD', path: '../src/sub' }
 *    ]
 *
 *
 *  // Clean up the path values
 *  [
 *    { name: 'HelloA', path: 'HelloA' },
 *    { name: 'HelloB', path: 'HelloB' },
 *    { name: 'HelloC', path: 'HelloC' },
 *    { name: 'HelloD', path: 'sub/HelloD' }
 *  ]
 */
