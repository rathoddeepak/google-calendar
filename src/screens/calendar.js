import React, {Component} from 'react';
import {
  View,
  Text,
  StatusBar,
  Dimensions,  
  FlatList,
  ScrollView,
  TouchableOpacity
} from 'react-native';
import Icon from 'components/icon';
import Timeline from 'components/timeline';
import hourList from 'assets/hourList';
import theme from 'assets/theme';
import calendarDummyDates from 'assets/calendarDummyDates';
import AddModal from 'components/addModal';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Calendar } from 'react-native-big-calendar'
const thisMonthStamp = 1664627943;
const {
  width,
  height
} = Dimensions.get('window');
const timelineHeight = hourList.length * 41;

const today = new Date();
export default class extends Component {
	constructor(props){
		super(props)
		this.state = {
			pickDate : false,
			monthText : 'October',
			days: calendarDummyDates
		};
	}
	componentDidMount () {
		StatusBar.setBarStyle("dark-content")
		StatusBar.setBackgroundColor(theme.bgColor);
	}
	render () {
		const {			
			monthText,
			pickDate,
			days
		} = this.state;
		return (
		  <View style={s.main}>
		   <View style={s.header.main}>
		    
		    <View style={s.header.topRowHeader}>
		     <View style={s.header.iconCover}> 
		     <Icon name='menu' size={26} color={theme.grey} />
		     </View>
		     <View style={s.header.monthPicker}>
		      <Text style={s.header.monthPickerTxt}>{monthText}</Text>
		      <Icon name='chevronDown' color={theme.grey} size={14} />
		     </View>
		     <View style={s.header.iconCover}>
		      <Icon name='search' size={26} color={theme.grey} />
		     </View>
		     <View style={s.header.iconCover}>
		      <Icon name='calendar' size={26} color={theme.grey} />
		     </View>
		     <View style={s.header.iconCover}>
		      <Icon name='more' size={26} color={theme.grey} />
		     </View>
		    </View>
		    <FlatList
					 horizontal
					 data={days}	
					 scrollEnabled={false}
					 ref={ref => this.timelineHeader = ref}	 
	         renderItem={this.renderTimelineHeader}
	         contentContainerStyle={{paddingLeft : 50, marginTop : 10}}
			/>
		   </View>		   

			<ScrollView nestedScrollEnabled><View style={{flexDirection : 'row', flex : 1, marginTop : 10}}>
			
			<View style={s.timeList.main}>
			{hourList.map(this.renderHour)} 
			</View>

			<View style={{flex : 1}}><FlatList
		     horizontal		     		    
			 data={days}
			 ref={ref => this.timeLineContent = ref}
			 onScroll={this.onTimeLineScroll}
			 contentContainerStyle={{height : timelineHeight}}
	         renderItem={this.renderTimelineContent}
			/></View></View></ScrollView>

			<AddModal
			 ref={ref => this.addTaskModal = ref}
			/>


			<TouchableOpacity activeOpacity={0.8} onPress={this.handleAdd} style={s.addBtn.main}>
			 <Icon name="add" color='default' size={35} />
			</TouchableOpacity>


			{pickDate ? <DateTimePicker
				  value={today}
				  mode='date'
				  onChange={this.handleSelectDate}
				 /> : null}

		  </View>
		)
	}

	renderTimelineHeader = ({item : {weekDay, day, events}}) => {
		return (
			<View style={s.timeHeader.main}>
			 <Text style={s.timeHeader.weekDay}>{weekDay}</Text>
			 <Text style={s.timeHeader.day}>{day}</Text>
			</View>				
		)
	}

	renderTimelineContent = ({item : {data}, index}) => {
		return (
			<Timeline
		 		data={data}
		 		addTask={hr => this.handleAddTask(hr, index)}
		 		updateTask={(task, taskIndex) => this.handleUpdateTask(task, taskIndex, index)}
		 	/>
		)
	}

	renderHour = ({txt}) => {
		return (
			<View style={s.timeList.item} key={txt}>
			 <Text style={s.timeList.txt}>{txt}</Text>
			</View>
		)
	}

	onTimeLineScroll = ({nativeEvent : {contentOffset}}) => {
		this.timelineHeader?.scrollToOffset({ offset : contentOffset.x, animated: false })
	}

	handleAddTask = (time, index) => {
		const {days} = this.state;
		let monthDay = days[index];
		let dateToAdd = new Date(thisMonthStamp * 1000);
		dateToAdd.setHours(time.hr);
		dateToAdd.setDate(monthDay.day);
		dateToAdd.setMinutes(0);
		let startHr = dateToAdd.getHours();
		let startMin = dateToAdd.getMinutes();
		let endHr = dateToAdd.getHours() + 1;
		let endMin = dateToAdd.getMinutes();
		this.addTaskModal.show({
			dateToAdd,
			startHr,
			startMin,
			endHr,
			endMin
		}, (task) => {
			this.dispatchTask(task);
		})
	}

	handleUpdateTask = (task, taskIndex, index) => {
		const {days} = this.state;
		let monthDay = days[index];
		let dateToAdd = new Date(thisMonthStamp * 1000);
		dateToAdd.setDate(task.date);		
		let startHr = task.startHr;
		let startMin = task.startMin;
		let endHr = task.endHr;
		let endMin = task.endMin;
		this.addTaskModal.show({
			index : taskIndex,
			dateToAdd,
			startHr,
			startMin,
			endHr,
			endMin,
			name : task.name,
			description : task.description,
			showRecurring : false
		}, (task) => {
			this.dispatchTask(task);
		})
	}

	handleAdd = () => {
			this.setState({
				pickDate : true
			})
	}

	handleSelectDate = ({type, nativeEvent}) => {
		this.setState ({
			pickDate : false
		})
		if(type == "set"){
			let dateToAdd = new Date(nativeEvent.timestamp);
			let startHr = dateToAdd.getHours();
			let startMin = dateToAdd.getMinutes();
			let endHr = dateToAdd.getHours() + 1;
			let endMin = dateToAdd.getMinutes();
			this.addTaskModal.show({
				dateToAdd,
				startHr,
				startMin,
				endHr,
				endMin,
				showRecurring : false
			}, (task) => {
				this.dispatchTask(task);
			})
		}		
	}

	dispatchTask = ({date, startHr, endHr, endMin, startMin, name, description, taskIndex}) => {
		const {days} = this.state;
		let index = days.findIndex(monthDay => monthDay.day == date);
		if(index == -1){
			alert('Please Select Date From October Month')
			return;
		}
		let day = days[index];
		let updated = {
			hr : startHr,
			min : startMin,
			date,
			startHr,
			startMin,
			endMin,
			endHr,
			name,
			description
		};
		if(taskIndex != -1){
			if(day?.data[taskIndex] != undefined){
				day.data[taskIndex] = updated;
			}			
		}else{
			if(day?.data == undefined){
				day.data = []
			}
			day.data.push(updated)
		}
		days[index] = day;
		this.setState({days}, () => {
			this.timeLineContent.scrollToIndex({index, animated : false})
		})
	}
}
const s = {
	addBtn : {
		main : {
			backgroundColor : theme.bgColor,
			elevation : 5,
			borderRadius : 100,
			justifyContent : 'center',
			alignItems : 'center',
			position : 'absolute',
			bottom : 20,
			right : 10,
			height : 55,
			width : 55
		}
	},
  timeList : {
  	main : {
	  	width : 55,
  	},
  	item : {
  		height : 40,
  		alignItems : 'center'
  	},
  	txt : {
  		fontSize : 13,
  		color : theme.grey
  	}
  },
  timeHeader : {
	main : {width : 60, height : 60, alignItems : 'center', backgroundColor : theme.bgColor },
	weekDay : {fontSize : 13, color : theme.grey},
	day : {fontSize : 20, color : theme.fgColor} 
  },
  //Using direct values such that they are faster
  main : {
    height,
    width,
    backgroundColor : '#ffffff'
  },

  header : {
    main : {
      width,
      backgroundColor : theme.bgColor,
      padding : 5,
      elevation : 5,
      zIndex : 1
    },
    topRowHeader : {
      flexDirection : 'row',
      height : 50,
      width,
    },
    iconCover : {
      width : 50,
      height : 50,
      justifyContent : 'center',
      alignItems : 'center'
    },
    monthPicker : {
      flexDirection : 'row',
      height : 50,
      flex : 1,
      alignItems : 'center'
    },
    monthPickerTxt : {
      fontSize : 20,
      fontWeight : '400',
      marginHorizontal : 5,      
      color : theme.fgColor,      
    }
  }
}