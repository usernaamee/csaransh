import React from "react";
import PropTypes from "../../../../../../../Library/Caches/typescript/2.9/node_modules/@types/prop-types./../../../Library/Caches/typescript/2.9/node_modules/@types/prop-types";
// @material-ui/core components
import withStyles from "@material-ui/core/styles/withStyles";
// core components
import typographyStyle from "assets/jss/material-dashboard-react/components/typographyStyle.js";

function Info({ ...props }) {
  const { classes, children } = props;
  return (
    <div className={classes.defaultFontStyle + " " + classes.infoText}>
      {children}
    </div>
  );
}

Info.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(typographyStyle)(Info);
