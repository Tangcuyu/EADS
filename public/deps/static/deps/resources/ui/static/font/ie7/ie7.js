/* To avoid CSS expressions while still supporting IE 7 and IE 6, use this script */
/* The script tag referencing this file must be placed before the ending body tag. */

/* Use conditional comments in order to target IE 7 and older:
	<!--[if lt IE 8]><!-->
	<script src="ie7/ie7.js"></script>
	<!--<![endif]-->
*/

(function() {
	function addIcon(el, entity) {
		var html = el.innerHTML;
		el.innerHTML = '<span style="font-family: \'iconMap\'">' + entity + '</span>' + html;
	}
	var icons = {
		'iconMap-drawerLeft': '&#xe960;',
		'iconMap-drawerRight': '&#xe961;',
		'iconMap-dataAggregation': '&#xe95b;',
		'iconMap-allAnalysis': '&#xe95c;',
		'iconMap-dataSharing': '&#xe95d;',
		'iconMap-auxiliaryDecision': '&#xe95e;',
		'iconMap-demoApplication': '&#xe95f;',
		'iconMap-doubleMapLink': '&#xe95a;',
		'iconMap-analysisReport': '&#xe956;',
		'iconMap-backtrack': '&#xe957;',
		'iconMap-location': '&#xe958;',
		'iconMap-water': '&#xe959;',
		'iconMap-removeUser': '&#xe94e;',
		'iconMap-invited': '&#xe94d;',
		'iconMap-SynergyConsultation': '&#xe954;',
		'iconMap-addAround': '&#xe947;',
		'iconMap-addCircle': '&#xe948;',
		'iconMap-conference': '&#xe949;',
		'iconMap-dialogue': '&#xe94a;',
		'iconMap-folder': '&#xe94b;',
		'iconMap-invitation': '&#xe94c;',
		'iconMap-minusAround': '&#xe94f;',
		'iconMap-modelAnalysis': '&#xe950;',
		'iconMap-notice': '&#xe951;',
		'iconMap-pdf': '&#xe952;',
		'iconMap-searchRecord': '&#xe953;',
		'iconMap-visionSynchronization': '&#xe955;',
		'iconMap-pavilion': '&#xe944;',
		'iconMap-typhon': '&#xe945;',
		'iconMap-vedio': '&#xe946;',
		'iconMap-pause': '&#xe941;',
		'iconMap-set': '&#xe942;',
		'iconMap-play': '&#xe943;',
		'iconMap-calendar': '&#xe93d;',
		'iconMap-diagram': '&#xe93e;',
		'iconMap-pullNorth': '&#xe93f;',
		'iconMap-infoSend': '&#xe940;',
		'iconMap-self-definedSearch': '&#xe937;',
		'iconMap-fasttips': '&#xe939;',
		'iconMap-reliefArea': '&#xe93a;',
		'iconMap-administrativeDivision': '&#xe93b;',
		'iconMap-sure': '&#xe938;',
		'iconMap-desRemove': '&#xe936;',
		'iconMap-ok': '&#xe926;',
		'iconMap-edit': '&#xe927;',
		'iconMap-delete': '&#xe928;',
		'iconMap-back': '&#xe929;',
		'iconMap-shinClose': '&#xe92a;',
		'iconMap-tabDelete': '&#xe93c;',
		'iconMap-eyeOpen': '&#xe92b;',
		'iconMap-eyeClose': '&#xe92c;',
		'iconMap-more': '&#xe92d;',
		'iconMap-info': '&#xe92e;',
		'iconMap-infoSearch': '&#xe92f;',
		'iconMap-download': '&#xe930;',
		'iconMap-circleClose': '&#xe931;',
		'iconMap-telphone': '&#xe932;',
		'iconMap-message': '&#xe933;',
		'iconMap-trangleRight': '&#xe934;',
		'iconMap-sureAround': '&#xe935;',
		'iconMap-close': '&#xe91e;',
		'iconMap-dataVisualization': '&#xe915;',
		'iconMap-search': '&#xe924;',
		'iconMap-emergencyDisposal': '&#xe91c;',
		'iconMap-dataCollection': '&#xe914;',
		'iconMap-serviceManagement': '&#xe909;',
		'iconMap-thematicPavilion': '&#xe922;',
		'iconMap-trangleSouth': '&#xe91b;',
		'iconMap-pullSouth': '&#xe91a;',
		'iconMap-measure': '&#xe906;',
		'iconMap-plotting': '&#xe905;',
		'iconMap-layerManager': '&#xe919;',
		'iconMap-thematicCharting': '&#xe923;',
		'iconMap-printscreen': '&#xe907;',
		'iconMap-pathPlanning': '&#xe90c;',
		'iconMap-clear': '&#xe90e;',
		'iconMap-fullScreen': '&#xe910;',
		'iconMap-toolbox': '&#xe90a;',
		'iconMap-rangeMeasurement': '&#xe90b;',
		'iconMap-planimetering': '&#xe90d;',
		'iconMap-add': '&#xe902;',
		'iconMap-minus': '&#xe901;',
		'iconMap-pullLeft': '&#xe917;',
		'iconMap-pullWest': '&#xe925;',
		'iconMap-TeamEquipment': '&#xe908;',
		'iconMap-specialist': '&#xe900;',
		'iconMap-dangerousSource': '&#xe918;',
		'iconMap-keyLine': '&#xe921;',
		'iconMap-keyArea': '&#xe920;',
		'iconMap-channelInfo': '&#xe90f;',
		'iconMap-peopleHeat': '&#xe911;',
		'iconMap-weather': '&#xe916;',
		'iconMap-realTimeMonitor': '&#xe912;',
		'iconMap-GPS': '&#xe903;',
		'iconMap-warnInfo': '&#xe91f;',
		'iconMap-videoMonitor': '&#xe913;',
		'iconMap-eagle': '&#xe904;',
		'iconMap-pullRight': '&#xe91d;',
		'0': 0
		},
		els = document.getElementsByTagName('*'),
		i, c, el;
	for (i = 0; ; i += 1) {
		el = els[i];
		if(!el) {
			break;
		}
		c = el.className;
		c = c.match(/iconMap-[^\s'"]+/);
		if (c && icons[c[0]]) {
			addIcon(el, icons[c[0]]);
		}
	}
}());
