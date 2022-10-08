import moment from 'moment';

const utils = {
	getTime (date) {
		const stamp = parseInt(date / 1000);
		return moment.unix(stamp).format('HH:mm a')
	},
	getDate (date) {
		const stamp = parseInt(date / 1000);
		return moment.unix(stamp).format('MMM DD')
	}
}

export default utils;