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
