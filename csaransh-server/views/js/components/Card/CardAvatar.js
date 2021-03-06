import React from "react";
// nodejs library that concatenates classes
import classNames from "../../../../../../../Library/Caches/typescript/2.9/node_modules/@types/classnames./../../../Library/Caches/typescript/2.9/node_modules/@types/classnames";
// nodejs library to set properties for components
import PropTypes from "../../../../../../../Library/Caches/typescript/2.9/node_modules/@types/prop-types./../../../Library/Caches/typescript/2.9/node_modules/@types/prop-types";
// @material-ui/core components
import withStyles from "@material-ui/core/styles/withStyles";
// @material-ui/icons
// core components

import cardAvatarStyle from "assets/jss/material-dashboard-react/components/cardAvatarStyle.js";

function CardAvatar({ ...props }) {
  const { classes, children, className, plain, profile, ...rest } = props;
  const cardAvatarClasses = classNames({
    [classes.cardAvatar]: true,
    [classes.cardAvatarProfile]: profile,
    [classes.cardAvatarPlain]: plain,
    [className]: className !== undefined
  });
  return (
    <div className={cardAvatarClasses} {...rest}>
      {children}
    </div>
  );
}

CardAvatar.propTypes = {
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
  profile: PropTypes.bool,
  plain: PropTypes.bool
};

export default withStyles(cardAvatarStyle)(CardAvatar);
