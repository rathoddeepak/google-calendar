import React, {Component} from 'react';
import {
  View,
  Text,
  Dimensions,
  ScrollView,
  TouchableOpacity
} from 'react-native';
import hourList from 'assets/hourList';
import theme from 'assets/theme';
const {
  width,
  height
} = Dimensions.get('window');
export default class extends Component {
	constructor(props){
		super(props)
		this.state = {

		};
	}
	render () {		
		return (
		  <View style={s.main}>
		   {hourList.map(this.renderHour)}
		  </View>
		)
	}
	renderHour = (hour, index) => {
		const {
			data
		} = this.props;
		const tasks = data[`${hour.hr}`] || [];
		return (
			<TouchableOpacity activeOpacity={1} onPress={() => this.props?.addTask(hour)} style={s.hour} key={hour.txt}>
			 {tasks.map((task, idx) => <Text onPress={() => this.props?.updateTask(task, idx)} key={task.name} style={s.task}>{task.name}</Text>)}
			</TouchableOpacity>
		)
	}
}

const s = {
  hour : {
  	width : 60,
  	height : 40,
  	borderLeftWidth : 1,
  	borderBottomWidth : 1,
  	borderColor : theme.faint
  },
  task : {
  	fontSize : 11,
  	color : theme.bgColor,
  	textAlign : 'center',
  	borderRadius : 5,
  	marginBottom : 2,
  	padding : 5,
  	backgroundColor : theme.primary
  },
  main : {
    width : 60,
    backgroundColor : theme.bgColor
  },
}