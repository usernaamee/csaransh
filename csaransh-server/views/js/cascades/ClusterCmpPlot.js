import React from 'react';
//import Select from 'react-select';

import Grid from "@material-ui/core/Grid";
import GridItem from "components/Grid/GridItem.js";

import Card from "components/Card/Card.js";
import CardHeader from "components/Card/CardHeader.js";
import CardIcon from "components/Card/CardIcon.js";
import CardBody from "components/Card/CardBody.js";
import CardFooter from "components/Card/CardFooter.js";
import { ScatterCmpPlot } from "../cascades/3d-plots.js";
import ViewIcon from '@material-ui/icons/BubbleChart';

import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormHelperText from '@material-ui/core/FormHelperText';
import FormControl from '@material-ui/core/FormControl';
import FormGroup from '@material-ui/core/FormGroup';
import Select from '@material-ui/core/Select';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';

import Stepper from '@material-ui/core/Stepper';
import Step from '@material-ui/core/Step';
import StepButton from '@material-ui/core/StepButton';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';

export const getClusterCoord = (row, cid) => {
  let c = [[],[],[]];
  if (cid.length == 0) cid = getInitialSelection(row);
  if (cid) {
    for (const x of row.eigen_features[cid].coords) {
      c[0].push(x[0]);
      c[1].push(x[1]);
      c[2].push(x[2]);
    }
  }
  return c;
};

export const getClusterVar = (row, cid) => {
  if (cid.length == 0) cid = getInitialSelection(row);
  if (cid) {
    return row.eigen_features[cid].var[0] + ", " + row.eigen_features[cid].var[1];
  }
  return "";
};

export const getCids = (row) => {
  const cids = [];
  const c = Object.keys(row.features);
  for (const x of c) {
    cids.push({label:x, value:x});
  }
  return cids;
  //const curSelection = (cids.length > 0) ? cids[0] : "";
};

export const getInitialSelection = (row) => {
  const cids = getCids(row);
  if (cids.length > 0) return cids[0].value;
  else "";
}

const getCmpCoord = (row, cid, data, mode, isSize, val) => {
  if (cid == '') return getClusterCoord(row, cid);
  if (!(row.clust_cmp_size.hasOwnProperty(cid))) {
    const cids = getCids(row);
    if (cids.length > 0) cid = cids[0].value;
    else return [];
  }
  let x = row.clust_cmp[cid][mode];
  //let count = row.clust_cmp_size[cid][mode]
  if (isSize) x = row.clust_cmp_size[cid][mode];
  if (val >= x.length) return getClusterCoord(row, '');
  const fid = parseInt(x[val][1]);
  return getClusterCoord(data[fid], x[val][2]);
};

const getCmpCids = (row, cid, data, mode, isSize) => {
  if (cid == '') return [];
  if (!(row.clust_cmp_size.hasOwnProperty(cid))) {
    const cids = getCids(row);
    if (cids.length > 0) cid = cids[0].value;
    else return [];
  }
  let scores = row.clust_cmp[cid][mode];
  if (isSize) {
    scores = row.clust_cmp_size[cid][mode];
  }
  return scores.map(x => {
    const name = x[2] + '-' + data[x[1]].name;
    const info = "diff: " + (x[0]).toFixed(2) + " eigen-var: " + 
           data[x[1]].eigen_features[x[2]]["var"][0] + ", " + data[x[1]].eigen_features[x[2]]["var"][1];
    return {"name": name, "info": info};
  });
};

export class ClusterCmpPlot extends React.Component {
  constructor(props) {
    super(props);
    this.allModes = [{label:"Angles", value:"angle"}, 
                     {label:"Adjacency", value:"adjNn2"},
                     {label:"Distances", value:"dist"},
                     {label:"All", value:"all"}
                    ];
    const curMode = "angle";
    const isSize = true;
    const curShow = 0;
    this.state = {
      curMode : curMode,
      isSize : isSize,
      curShow : curShow,
    };
  }

  handleMode(curMode) {
    this.setState({
      curMode
    });
  }

  handleIsSize(isSize) {
    //const isSize = !this.state.isSize;
    this.setState({
      isSize
    });
  }

  handleShow(val) {
    this.setState({
      curShow : val,
    });
  }

  render() {
    const cmpCids = getCmpCids(this.props.row, this.props.curSelection, this.props.data, this.state.curMode, this.state.isSize);
    const cmpCoords = getCmpCoord(this.props.row, this.props.curSelection, this.props.data, this.state.curMode, this.state.isSize, this.state.curShow);
    return (
    <Card chart>
      <CardHeader color="info">
      Cluster Comparison
      </CardHeader>
      <CardBody>
        <Grid container>
        <GridItem xs={12} sm={12} md={6}>
        <Paper>
        <ScatterCmpPlot coords={this.props.curCoords} colorIndex={parseInt(this.props.curSelection)} />
        <Typography  variant="caption" style={{textAlign:"center"}}>eigen dimensional var:{this.props.curVar}</Typography>
        <Grid container justify="center">
        <GridItem xs={12} sm={12} md={12} >
        <FormGroup column>
         <FormControl>
          <InputLabel htmlFor="cid-select">Cluster Id</InputLabel>
          <Select
            value={this.props.curSelection}
            onChange={(event) => { this.props.setCurSelection(event.target.value); }}
            inputProps={{
              name: 'cluster-selection',
              id: 'cid-select',
            }}
          >
          {this.props.cids.map((o, i) => <MenuItem key={i} value={o.value}>{o.label}</MenuItem>)}
          </Select>
          </FormControl>
         <FormControl>
          <InputLabel htmlFor="cluster-mode">Similarity By</InputLabel>
          <Select
            value={this.state.curMode}
            onChange={(event) => { this.handleMode(event.target.value); }}
            inputProps={{
              name: 'cluster-mode',
              id: 'cluster-mode',
            }}
          >
          {this.allModes.map((o, i) => <MenuItem key={i} value={o.value}>{o.label}</MenuItem>)}
          </Select>
          </FormControl>
        <FormControlLabel
          control={
            <Checkbox
              checked={this.state.isSize}
              onChange={(event) => { this.handleIsSize(event.target.checked); }}
              value="isSize"
              color="primary"
            />
          }
          label="Match only clusters with similar number of defects"
        />
        </FormGroup>
        </GridItem>
        </Grid>
        </Paper>
        </GridItem>
       <GridItem xs={12} sm={12} md={6}>
        <ScatterCmpPlot coords={cmpCoords} colorIndex={parseInt(this.props.curSelection)}/>
        <Stepper alternativeLabel nonLinear activeStep={this.state.curShow}>
          {cmpCids.map((label, index) => {
            const buttonProps = {};
            buttonProps.optional = <Typography variant="caption">{label.info}</Typography>;
            return (
              <Step key={index} completed={false}>
                <StepButton
                  onClick={() => this.handleShow(index)}
                  completed={false}
                  {...buttonProps}
                >
                  {label.name}
                </StepButton>
              </Step>
            );
          })}
        </Stepper>
        </GridItem>
        </Grid>
      </CardBody>
      <CardFooter chart>
        <div className={this.props.classes.stats}>
          <ViewIcon/> For the selected cluster of the current cascade, shows the top similar clusters from the whole database. Plots are in eigen basis, eigen var hints at dimensionality.
        </div>
      </CardFooter>
   </Card>
    );
  }
}