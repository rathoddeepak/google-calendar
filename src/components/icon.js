import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
	Image
} from 'react-native';
const loc = 'assets/icons/'
export default class Icon extends Component {
	render() {
		const {name,size,color,style,resizeMode} = this.props;
		switch (name){
			case 'close':			
			return(<Image resizeMode={resizeMode} style={[{width: size,height: size}, style]} source={require(loc + 'close.png')} tintColor={color} />);
			case 'search':			
			return(<Image resizeMode={resizeMode} style={[{width: size,height: size}, style]} source={require(loc + 'search.png')} tintColor={color} />);
			case 'calendar':			
			return(<Image resizeMode={resizeMode} style={[{width: size,height: size}, style]} source={require(loc + 'calendar.png')} tintColor={color} />);
			case 'more':			
			return(<Image resizeMode={resizeMode} style={[{width: size,height: size}, style]} source={require(loc + 'more.png')} tintColor={color} />);
			case 'add':			
			return(<Image resizeMode={resizeMode} style={[{width: size,height: size}, style]} source={require(loc + 'add.png')} tintColor={color} />);
			case 'chevronDown':			
			return(<Image resizeMode={resizeMode} style={[{width: size,height: size}, style]} source={require(loc + 'chevronDown.png')} tintColor={color} />);			
			default:
			return(<Image resizeMode={resizeMode} style={[{width: size,height: size}, style]} source={require(loc + 'menu.png')} tintColor={color} />);
		}
	}
}

Icon.defaultProps = {
	name:'menu',
	size:22,
	color:'#fff',
	style:{},
	resizeMode:'center'
}
Icon.propTypes = {
	name:PropTypes.string,
	size:PropTypes.number,
	color:PropTypes.string,
	style:PropTypes.object,
	resizeMode:PropTypes.string,
}