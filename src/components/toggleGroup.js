import React, {Component} from 'react';
import {
	View,
	Text,
	TouchableOpacity,
	FlatList
} from 'react-native';
import theme from 'assets/theme';

export default class ToggleGroup extends Component {
	render () {
		const {
			values,
			bw,
			style
		} = this.props;
		const borderWidth = bw == undefined ? 1 : bw;
		return (
			<View style={[s.main, {borderWidth}, style]}>
				<FlatList
				 horizontal
				 renderItem={this.renderItem}
				 data={values}
				 ref={ref => this.flatList = ref}
				 contentContainerStyle={{height:50,alignItems:'center'}}
				/>
			</View>
		)
	}
	renderItem = ({item, index}) => {
		const selected = this.props.selected == item.value;
		return (
			<TouchableOpacity activeOpacity={0.8} onPress={() => this.handleSelect(item.value, index)} style={[s.item, {backgroundColor : selected ? theme.primary : 'transparent'}]}>
			 <Text style={[s.txt, {color : selected ? theme.bgColor : theme.grey}]}>{item.label}</Text>
			</TouchableOpacity>
		)
	}
	handleSelect = (value, index) => {
		this.props?.onSelect(value);
		this.flatList.scrollToIndex({animated: true, index})
	}
}

const s = {
	main : {
		width : '100%',
		height : 50,
		borderColor : theme.faint,
		backgroundColor : theme.bgColor,
		borderRadius : 10,
		justifyContent:'center'
	},
	item : {
		borderRadius : 8,
		height : 35,
		paddingHorizontal : 20,
		justifyContent : 'center',
		alignItems : 'center',
		marginHorizontal: 10
	},
	txt : {
		fontSize : 14
	}
}