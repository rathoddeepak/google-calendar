import React, {Component} from 'react';
import {
	View,
	Text,
	TextInput,
	Modal,
	TouchableOpacity,
	Switch
} from 'react-native';
import Icon from './icon';
import ToggleGroup from './toggleGroup';
import theme from 'assets/theme';
import utils from 'libs/utils';
import DateTimePicker from '@react-native-community/datetimepicker';
const types = [
	{
		value : 0,
		label : `All Days`
	},
	{
		value : 1,
		label : `Weekly`
	}
]
export default class AddModal extends Component {
	constructor (props) {
		super (props)
		this.state = {
			v : false,
			endTime : new Date(),
			startTime : new Date(),
			dateToAdd : new Date(),
			recurringType : 0,
			recurringEnabled : false,
			pickStartDate : false,
			pickEndDate : false,
			showRecurring : false,
			taskIndex: -1,

			name : '',
			description : '',

		}
		this.cb = null;
	}
	show = ({startHr, startMin, endHr, endMin, dateToAdd, index, name, description, showRecurring}, callback) => {
		const startTime = new Date(dateToAdd.getTime());
		startTime.setHours(startHr);
		startTime.setMinutes(startMin);
		const endTime = new Date(dateToAdd.getTime());
		endTime.setHours(endHr);
		endTime.setMinutes(endMin);
		this.setState({
			dateToAdd,
			startTime,
			endTime,
			v:true,
			description,
			name,
			taskIndex : index == undefined ? -1 : index,
			showRecurring : showRecurring || false
		})
		this.cb = callback
	}
	close = () => {
		this.setState({
			v : false,
			name : '',
			description : '',
			taskIndex : -1
		}, () => {
			this.cb = null;
		})
	}
	render () {		
		const {
			v,
			name,
			description,
			startTime,
			endTime,
			recurringType,
			recurringEnabled,
			pickStartDate,
			pickEndDate,
			taskIndex,
			dateToAdd,
			showRecurring
		} = this.state;
		const startTimeTxt = utils.getTime(startTime);
		const endTimeTxt = utils.getTime(endTime);
		const dateToAddTxt = utils.getDate(dateToAdd);
		const added = taskIndex != -1;
		return (
			<Modal transparent onRequestClose={this.close} visible={v} animationType="slide"> 
			 <TouchableOpacity activeOpacity={1} style={s.main} onPress={this.close}>
			  <TouchableOpacity activeOpacity={1} style={s.content}>
			   <Text style={s.title}>{added ? 'Update' : 'Create'} Task | {dateToAddTxt}</Text>
			   <TouchableOpacity onPress={this.close} style={s.close}>
			    <Icon name='close' size={25} color={theme.fgColor} />
			   </TouchableOpacity>

			   <TouchableOpacity onPress={this.selectStartTime} style={s.holder}>
			    <Text style={s.holderTxt}>{startTimeTxt}</Text>
			   </TouchableOpacity>

			   <TouchableOpacity onPress={this.selectEndTime} style={s.holder}>
			    <Text style={s.holderTxt}>{endTimeTxt}</Text>
			   </TouchableOpacity>

			   <TextInput
			    style={s.input}
			    placeholderTextColor={theme.grey}
			    placeholder="Name"
			    value={name}
			    onChangeText={name => this.setState({name})}
			   />

			   <TextInput
			    style={s.input}
			    placeholder="description"
			    placeholderTextColor={theme.grey}
			    value={description}
			    onChangeText={description => this.setState({description})}
			   />

			   {showRecurring ? <Recurring
			    onChange={this.handleRecurringChange}
			   /> : false}

			    {recurringEnabled ? <ToggleGroup
					values={types}
					selected={recurringType}
					style={{marginBottom : 10}}
					onSelect={recurringType => this.setState({recurringType:recurringType})}
				/> : null}


			   <TouchableOpacity activeOpacity={0.7} onPress={this.taskAction} style={s.button}>
			    <Text style={s.buttonTxt}>Add Task</Text>
			   </TouchableOpacity>

			   {pickStartDate ? <DateTimePicker
				  value={startTime}
				  mode='time'
				  onChange={this.startTimeChange}
				 /> : null}

				{pickEndDate ? <DateTimePicker
				  value={endTime}
				  mode='time'
				  onChange={this.endTimeChange}
				 /> : null}

			  </TouchableOpacity>
			 </TouchableOpacity>
			</Modal>
		)
	}

	handleRecurringChange = (recurringEnabled) => {
		this.setState({
			recurringEnabled
		})
	}

	startTimeChange = ({nativeEvent, type}) => {
		this.setState({
			pickStartDate : false
		})		
		if(type == "set"){
			this.setState({startTime : new Date(nativeEvent.timestamp)})
		}	
	}

	endTimeChange = ({nativeEvent, type}) => {
		this.setState({
			pickEndDate : false
		})		
		if(type == "set"){
			this.setState({endTime : new Date(nativeEvent.timestamp)})
		}	
	}

	selectStartTime = () => {
		this.setState({
			pickStartDate : true
		})
	}

	selectEndTime = () => {
		this.setState({
			pickEndDate : true
		})
	}

	taskAction = () => {
		const {startTime, endTime, dateToAdd, name, description, taskIndex} = this.state;
		if(startTime.getTime() > endTime.getTime()){
			alert("Start Time can't greater than end time");
			return
		}else if(name == undefined || name?.length == 0){
			alert("Name is required");
			return
		}
		let startHr = startTime.getHours();
		let startMin = startTime.getMinutes();

		let endHr = endTime.getHours();
		let endMin = endTime.getMinutes();

		let date = dateToAdd.getDate();
		if(this.cb != null){
			this.cb(
				{
					name, description, date, startHr, endHr, endMin, startMin, taskIndex
				}
			);
		}		
		this.close();
	}
}

class Recurring extends Component {
	constructor(props){
		super (props)
		this.state = {
			defaultValue : false
		}
	}
	componentDidMount () {
		let v = this.props?.value || false;
		this.setValue(v)
	}
	setValue = (defaultValue) => {
		this.setState ({
			defaultValue
		})
	}
	handleChange = (defaultValue) => {
		this.setState ({
			defaultValue
		}, () => {
			this.props?.onChange(defaultValue);
		})
	}
	render () {
		const {
			defaultValue
		} = this.state;
		return (
			<View style={s.recurring.main}>
			 <Text style={s.recurring.txt}>Recurring</Text>
			 <Switch
			  value={defaultValue}
			  thumbColor={defaultValue ? theme.primary : undefined}
			  trackColor={{false:theme.grey, true : theme.light}}
			  onValueChange={this.handleChange}
			 />
			</View>
		)
	}
}

const s = {
	recurring : {
		main : {
			width : '100%',
			flexDirection : 'row',
			height : 50,
			width : '100%',
			borderRadius : 10,
			borderWidth : 1,
			paddingLeft : 10,
			borderColor : theme.faint,
			alignItems:'center',
			justifyContent : 'space-between',
			marginBottom : 10
		},
		txt  : {
			fontSize : 15,
			color : theme.fgColor
		}
	},
	close : {
  		width : 50,
  		height : 50,
  		position : 'absolute',
  		top : 17,
  		right : -10
  	},
  	main : {
  		backgroundColor : '#00000024',
  		justifyContent : 'flex-end',
  		alignItems : 'center',
  		height : '100%',
  		width : '100%'
  	},
  	content : {
  		width : '100%',
  		backgroundColor : theme.bgColor,
  		borderTopLeftRadius : 10,
  		borderTopRightRadius : 10,
  		padding : 10
  	},
  	title : {
  		fontSize : 20,
  		color : theme.fgColor,
  		fontWeight : 'bold',
  		marginBottom : 20
  	},
	holder : {
		height : 50,
		width : '100%',
		borderRadius : 10,
		borderWidth : 1,
		paddingLeft : 10,
		borderColor : theme.faint,
		justifyContent : 'center',
		marginBottom : 10
	},
	holderTxt : {
		fontSize : 15,
		color : theme.fgColor
	},
	input : {
		height : 50,
		width : '100%',
		borderRadius : 10,
		borderWidth : 1,
		paddingLeft : 10,
		borderColor : theme.faint,
		fontSize : 15,
		color : theme.fgColor,
		marginBottom : 10
	},
	button : {
		height : 50,
		width : '100%',
		borderRadius : 10,
		backgroundColor : theme.light,
		justifyContent : 'center',
		alignItems : 'center',
		marginBottom : 5
	},
	buttonTxt : {
		fontSize : 15,
		fontWeight : 'bold',
		color : theme.primary
	}
}