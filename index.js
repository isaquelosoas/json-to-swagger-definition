const fs = require('fs');
const yaml = require('js-yaml');
//read a json file

const json = JSON.parse(fs.readFileSync('definition.json', 'utf8'));
const jsonObjects = Object.keys(json);
// save a yaml file
const tab = '    ';
let yamlString = `DefinitionName:`;
yamlString += `\n  type: object`;
yamlString += `\n  properties:`;

const addObjectToString = (obj, jsonTab, isArray = false) => {
    const objKeys = Object.keys(obj);
    console.log(objKeys);
    objKeys.forEach((key) => {
        const type = typeof obj[key];
        let objTab = jsonTab;
        if (type === 'object' && Array.isArray(obj[key]) === false) {
            if (!isArray) {
                yamlString += `\n${objTab}${key}:`;
                objTab += tab;
            }
            yamlString += `\n${objTab}type: object`;
            yamlString += `\n${objTab}properties:`;
            addObjectToString(obj[key], (objTab += tab));
        } else if (Array.isArray(obj[key])) {
            const firstElement = obj[key][0];
            yamlString += `\n${objTab}${key}:`;
            objTab += tab;
            yamlString += `\n${objTab}type: array`;
            yamlString += `\n${objTab}items:`;
            addObjectToString({ firstElement }, (objTab += tab), true);
        } else {
            yamlString += `\n${objTab}${key}:`;
            objTab += tab;
            yamlString += `\n${objTab}type: ${type}`;
            yamlString += `\n${objTab}example: ${obj[key] ? obj[key] : '""'}`;
        }
    });
};

addObjectToString(json, tab);

const obj = yaml.load(yamlString);

fs.writeFileSync('definition.yaml', yamlString);
