exports.files = {
    javascripts: {
        joinTo: {
            'app.js': /^app/
        }
    },
    stylesheets: {joinTo: 'app.css'}
};

exports.modules = {
    autoRequire: {
        'app.js': ['initialize']
    }
};

exports.plugins = {
    babel: {presets: ['latest']},
    copycat:{
        modules: ['node_modules/p5/lib/p5.min.js', 'node_modules/p5/lib/addons/p5.sound.min.js'],
        verbose : true,
        onlyChanged: true
    }
};