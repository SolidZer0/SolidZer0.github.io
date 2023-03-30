import React, { useEffect } from 'react'

import App from "../app";
import { toTitleCase } from "../utils";


const SetChoices = ({milanesa=false}) => {
  useEffect(() => {
  }, [])
  let groups = [];
  for (let setType in App.state.availableSets) {
    const allSets = App.state.availableSets[setType];
    let options = [];
    allSets.forEach(({ code, name }) => {
      options.push(
        <option value={milanesa ?  JSON.stringify({code, name}) : code} key={code}>{name}</option>
      );
    });
    groups.push(
      <optgroup label={toTitleCase(setType, "_")} key={setType}>{options}</optgroup>
    );
  }
  return groups;
}

export default SetChoices;
