import React, {PureComponent} from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableWithoutFeedback
} from 'react-native';
import hourList from 'assets/hourList';
import theme from 'assets/theme';

export default class extends PureComponent {
	constructor(props){
		super(props)
		this.state = {

		};
	}
	render () {
		const {
			data
		} = this.props;
		return (
		  <View style={s.main}>
		   {hourList.map(this.renderHour)}
		   {data.map(this.plotTask)}
		  </View>
		)
	}
	renderHour = (hour, index) => {
		return (
			<>
			<TouchableWithoutFeedback onPress={() => this.props?.addTask(hour)}  key={hour.txt}><View style={s.hour}>
			 
			</View></TouchableWithoutFeedback>			
			</>
		)
	}

	plotTask = (task, idx) => {
		const {height, translateY} = calculateData(task);
		return <Text onPress={() => this.props?.updateTask(task, idx)} key={task.name} style={[s.task, {
			height,
			transform : [
			 {
			 	translateY
			 }
			]
		}]}>{task.name}</Text>
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
  	position : 'absolute',
  	width : 60,
  	zIndex : 20,
  	backgroundColor : theme.primary
  },
  main : {
    width : 60,
    backgroundColor : theme.bgColor
  },
}

const calculateData = (task) => {
	const hrDiff = task.endHr - task.startHr;
	if (hrDiff > 0){
		height = hrDiff * 40;
	}else{
		height = 15
	}

	let pos = (task.startHr - 1) * 40;
	let topExtra = task.startMin * (40/60)
	let translateY = pos + topExtra;

	let bottomExtra = task.endMin * (40/60);

	height = height + (bottomExtra - topExtra);
	return {height, translateY}
}