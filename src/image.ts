import {parse} from 'csv-parse/sync';
import * as core from '@actions/core';

export interface Image {
  name: string;
  enable: boolean;
}

export function Transform(inputs: string[]): Image[] {
  let images: Image[] = [];

  // backward compatibility with old format
  if (inputs.length == 1) {
    let newformat = false;
    var fields = parse(inputs[0], {
      relaxColumnCount: true,
      skipEmptyLines: true
    })[0];
    for (var field of fields) {
      var parts = field
        .toString()
        .split('=')
        .map(item => item.trim());
      if (parts.length == 1) {
        images.push({name: parts[0], enable: true});
      } else {
        newformat = true;
        break;
      }
    }
    if (!newformat) {
      return output(images);
    }
  }

  images = [];
  for (var input of inputs) {
    var image: Image = {name: '', enable: true};
    var fields = parse(input, {
      relaxColumnCount: true,
      skipEmptyLines: true
    })[0];
    for (var field of fields) {
      var parts = field
        .toString()
        .split('=')
        .map(item => item.trim());
      if (parts.length == 1) {
        image.name = parts[0];
      } else {
        var key = parts[0].toLowerCase();
        var value = parts[1];
        switch (key) {
          case 'name': {
            image.name = value;
            break;
          }
          case 'enable': {
            if (!['true', 'false'].includes(value)) {
              throw new Error(`Invalid enable attribute value: ${input}`);
            }
            image.enable = /true/i.test(value);
            break;
          }
          default: {
            throw new Error(`Unknown image attribute: ${input}`);
          }
        }
      }
    }
    if (image.name.length == 0) {
      throw new Error(`Image name attribute empty: ${input}`);
    }
    images.push(image);
  }
  return output(images);
}

function output(images: Image[]): Image[] {
  core.startGroup(`Processing images input`);
  for (var image of images) {
    core.info(`name=${image.name},enable=${image.enable}`);
  }
  core.endGroup();
  return images;
}
