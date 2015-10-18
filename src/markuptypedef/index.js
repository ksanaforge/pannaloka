var vs=require("./validateselection");
var vsmilestone=require("./validatemilestone");
var mark=require("./mark");
var docfilestore=require("../stores/docfile");
var markupstore=require("../stores/markup");

var isIntertextDeletable=function(markup) {
	var file=markup.target[0];
	return !!docfilestore.docOf(file);
}

var deletIntertext=function(markup) {
	markupstore.removeByMid(markup.target[1],markup.target[0]);
}


var types={

	"important":{validate:vs.singleone,label:"重點",
							editor:require("./simple"), mark:mark.singleone}
	,"title":{validate:vs.singleone,label:"大標",editor:require("./simple"),mark:mark.singleone}
	,"title2":{validate:vs.singleone,label:"中標",editor:require("./simple"),mark:mark.singleone}
	,"title3":{validate:vs.singleone,label:"小標",editor:require("./simple"),mark:mark.singleone}	
	,"dictionary":{validate:vs.singleone,label:"字典"}
	,"partofspeech":{validate:vs.singleone,label:"詞性"}
	,"intertext":{validate:vs.multi,label:"互文", mark:mark.dualone, editor:require("./quote"),
						isDeletable: isIntertextDeletable,onDelete:deletIntertext}
	,"quote":{validate:vs.dualone,label:"出處", mark:mark.oneway, editor:require("./quote")}
  ,"causeeffect":{validate:vs.singletwo,label:"因果",mark:mark.singletwo,editor:require("./simple")}
  ,"part":{validate:vs.singletwomore,label:"部份",mark:mark.singletwo,editor:require("./simple")}
  ,"synonym":{validate:vs.singletwomore,label:"同義",mark:mark.singletwo,editor:require("./simple")}
  ,"signifier":{validate:vs.singletwo,label:"能所",mark:mark.singletwo,editor:require("./simple")}
	,"milestone":{validate:vsmilestone.milestone,label:"界石",editor:require("./simple"), mark:mark.milestone}
	,"explain":{validate:vs.singletwomore,label:"內釋",mark:mark.singletwo,editor:require("./simple")}
	,"extexplain":{validate:vs.dualonemore,label:"外釋",mark:mark.dualonemore,editor:require("./simple")}
	,"causeeffect2":{label:"因：",hidden:true}
	,"intertext2":{label:"互文：",hidden:true}
	,"part2":{label:"部份：",hidden:true}
	,"signifier2":{label:"能指：",hidden:true}
	,"synonym2":{label:"基詞",hidden:true}
  ,"explain2"	:{label:"所解釋的名相：",hidden:true}
  ,"extexplain2"	:{label:"所解釋的名相：",hidden:true}
}

var getAvailableType=function(selections) {
	var out=[];
	for (var i in types) {
		if (types[i].validate && types[i].validate(selections) && !types[i].hidden){
			out.push(i);
		}
	}
	return out;
}
module.exports={getAvailableType:getAvailableType, types:types, 
	milestone_novalidate:mark.milestone_novalidate};