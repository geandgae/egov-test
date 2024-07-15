// node
const StyleDictionary = require("style-dictionary");


// preset
// const preset = `@charset "utf-8";\n\n//prefix\n$prefix: krds- !default;\n$box-shadow-base: 2px 2px 2px 0px rgba(0, 0, 0, 0.15) !default;\n\n`;
const preset = `
@charset "utf-8";


//prefix
$prefix: pre- !default;

//transition
$transition-base: .4s ease-in-out !default;
$transition-fade: opacity .4s linear !default;
$transition-collapse: max-height .4s ease !default;
$transition-collapse-width: width .4s ease !default;

//box shadow
$box-shadow-base: 2px 2px 2px 0px rgba(0, 0, 0, 0.15) !default;

// rounded
$rounded: (
  small: 4px,
  medium: 8px,
  large: 12px
);


`;

// transformName
function transformName(prop, slice, suffix) {
  if (suffix) {
    // const path = prop.path;
    // path[0] = suffix;
    // return path.join("-");
    const path = prop.path.slice(slice).join("-");
    return `${suffix}-${path}`;
  } else {
    // return prop.path.slice(1).join("-"); // 첫 번째 요소 제외
    // return prop.path.slice(-1).join("-"); // 마지막
    // return prop.path.slice(-2).join("-"); // 끝에서 두 번째 
    return prop.path.slice(slice).join("-");
  }
}

// custom
StyleDictionary.registerFormat({
  name: "custom/scss-format",
  formatter: function(dictionary) {
    const typeGroups = dictionary.allProperties.reduce((acc, prop) => {
      // const type = prop.type;
      const type = prop.path[0];
      // const type = prop.description;
      const name = transformName(prop, 1);

      if (!acc[type]) {
        acc[type] = [];
      }
      acc[type].push(`  ${name}: ${prop.value},`);
      return acc;
    }, {});

    const scssContent = Object.entries(typeGroups)
      .map(([type, tokens]) => {
        return `//${type}\n$${type}: (\n${tokens.join("\n")}\n)!default;`;
      })
      .join("\n\n");

    // return scssContent;
    return preset + scssContent;
  }
});


// custom cti
StyleDictionary.registerFormat({
  name: "custom/scss-format2",
  formatter: function(dictionary) {
    const typeGroups = dictionary.allProperties.reduce((acc, prop) => {
      // cti : category, type, item, subitem, state
      const { category, type, item } = prop.attributes;
      const name = transformName(prop, -1);

      // if (!acc[category]) {
      //   acc[category] = {};
      // }
      // if (!acc[category][type]) {
      //   acc[category][type] = {};
      // }
      // if (!acc[category][type][item]) {
      //   acc[category][type][item] = [];
      // }

      acc[category] ??= {};
      acc[category][type] ??= {};
      acc[category][type][item] ??= [];
      acc[category][type][item].push(`      ${name}: ${prop.value},`);
      return acc;
    }, {});

    const scssContent = Object.entries(typeGroups)
      .map(([category, types]) => {
        const typeContent = Object.entries(types)
          .map(([type, items]) => {
            const itemContent = Object.entries(items)
              .map(([item, tokens]) => {
                return `    ${item}: (\n${tokens.join("\n")}\n    ),`;
              })
              .join("\n");
            return `  ${type}: (\n${itemContent}\n  ),`;
          })
          .join("\n");
        return `$${category}: (\n${typeContent}\n)!default;`;
      })
      .join("\n\n");

    return scssContent;
  }
});


// custom cti2
StyleDictionary.registerFormat({
  name: "custom/scss-format3",
  formatter: function(dictionary) {
    const typeGroups = dictionary.allProperties.reduce((acc, prop) => {
      const { category, type } = prop.attributes;
      const name = transformName(prop, -2);

      acc[category] ??= {};
      acc[category][type] ??= [];
      acc[category][type].push(`    ${name}: ${prop.value},`);
      
      return acc;
    }, {});

    const scssContent = Object.entries(typeGroups)
      .map(([category, types]) => {
        const typeContent = Object.entries(types)
          .map(([type, tokens]) => {
            return `  ${type}: (\n${tokens.join("\n")}\n  ),`;
          })
          .join("\n");
        return `$${category}: (\n${typeContent}\n)!default;`;
      })
      .join("\n\n");

    return scssContent;
  }
});

// custom path
StyleDictionary.registerFormat({
  name: "custom/scss-format4",
  formatter: function(dictionary) {
    const typeGroups = dictionary.allProperties.reduce((acc, prop) => {
      const path0 = prop.path[0];
      const path1 = prop.path[1];
      const name = transformName(prop, -2, path1);

      acc[path0] ??= {};
      acc[path0][path1] ??= [];
      acc[path0][path1].push(`    ${name}: ${prop.value},`);
      
      return acc;
    }, {});

    const scssContent = Object.entries(typeGroups)
      .map(([path0, types]) => {
        const typeContent = Object.entries(types)
          .map(([path1, tokens]) => {
            return `  ${path1}: (\n${tokens.join("\n")}\n  ),`;
          })
          .join("\n");
        return `$${path0}: (\n${typeContent}\n)!default;`;
      })
      .join("\n\n");

    return scssContent;
  }
});




// registerFilter
StyleDictionary.registerFilter({
  name: 'isColor',
  matcher: function(prop) {
    return prop.type === "color";
  }
})
StyleDictionary.registerFilter({
  name: 'isString',
  matcher: function(prop) {
    return prop.type === "string";
  }
})
StyleDictionary.registerFilter({
  name: 'isDimension',
  matcher: function(prop) {
    return prop.type === "dimension";
  }
})
StyleDictionary.registerFilter({
  name: 'isNumber',
  matcher: function(prop) {
    return prop.type === "number";
  }
})


// export
module.exports = {
  source: [
    // "./tokens/**/*",
    // "./tokens/token.json",
    // "./tokens/design-token.json"
    // "./tokens/test.tokens.json"
    "./tokens/local-variables.tokens.json",
    "./tokens/style-typography.tokens.json",
    "./tokens/style-user.tokens.json"
  ],
  platforms: {
    scss: {
      transformGroup: "scss",
      buildPath: "./build/",
      files: [
        {
          destination: "_variables.scss",
          format: "custom/scss-format",
        },
      ],
    },
    // scss2: {
    //   transformGroup: "scss",
    //   buildPath: "./app/src/assets/scss/abstracts/",
    //   files: [
    //     {
    //       destination: "_variables2.scss",
    //       format: "custom/scss-format",
    //       filter: "isColor",
    //     },
    //   ],
    // },
    // scss3: {
    //   transformGroup: "scss",
    //   buildPath: "./app/src/assets/scss/abstracts/",
    //   files: [
    //     {
    //       destination: "_variables3.scss",
    //       format: "custom/scss-format",
    //       filter: "isString",
    //     },
    //   ],
    // },
    // scss4: {
    //   transformGroup: "scss",
    //   buildPath: "./app/src/assets/scss/abstracts/",
    //   files: [
    //     {
    //       destination: "_variables4.scss",
    //       format: "custom/scss-format",
    //       filter: "isDimension",
    //     },
    //   ],
    // },
    // scss5: {
    //   transformGroup: "scss",
    //   buildPath: "./app/src/assets/scss/abstracts/",
    //   files: [
    //     {
    //       destination: "_variables5.scss",
    //       format: "custom/scss-format",
    //       filter: "isNumber",
    //     },
    //   ],
    // },
  },
};