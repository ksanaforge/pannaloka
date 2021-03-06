/**
	Markup under cursor and editing
*/

var Reflux=require("reflux");

var docfilestore=require("./docfile");
var markupNav=require("../markup/nav");

var markupStore=Reflux.createStore({
	listenables:[require("../actions/markup")]
	,markupsUnderCursor:[]
	,ctrl_m_handler:null
	,editing:null
	,hovering:null
	,onMarkupsUnderCursor:function(markupsUnderCursor) {
		//this.editing=null;
		if (this.markupsUnderCursor==markupsUnderCursor) return;
		this.markupsUnderCursor=markupsUnderCursor||[];
		this.trigger(this.markupsUnderCursor,{cursor:true});
	}
	,getEditing:function() {
		return this.editing;
	}
	,getNext:function() {
		if (!this.editing) return;
		return markupNav.next(this.editing.markup);
	}
	,getPrev:function() {
		if (!this.editing) return;
		return markupNav.prev(this.editing.markup);
	}
	,cancelEdit:function() {
		this.editing=null;
		this.ctrl_m_handler=null;
	}
	,freeEditing:function() {
		if (!this.editing) return;
		this.editing.doc=null;//to notify markupselector shouldComponentUpdate
	}
	,onEditMarkup:function(markup) {
		this.cancelEdit();
		this.editing=markup;
		this.ctrl_m_handler=null;
		this.trigger([{doc:markup.handle.doc,key:markup.key,markup:markup}],{cursor:true});
	}
	,setEditing:function(markup,handler) {
		this.cancelEdit();
		this.editing=markup;
		this.ctrl_m_handler=handler;
		//this.trigger([],{cursor:true});
		this.trigger(markup,{editing:true});
	}
	,onSetHotkey:function(handler) {
		this.ctrl_m_handler=handler;
		//console.log("handler",handler,this);
	}
	,remove:function(markup) {
		//console.log("remove markup",markup);
		this.cancelEdit();
		var doc=markup.handle.doc;
		doc.getEditor().react.removeMarkup(markup.key);

		this.trigger([],{cursor:true});
	}
	,removeByMid:function(mid,file){
		//console.log("remove mid in file",mid,file);
		var doc=docfilestore.docOf(file);
		doc.getEditor().react.removeMarkup(mid);
		this.trigger([],{cursor:true});
	}
	,onToggleMarkup:function(){
		if (this.ctrl_m_handler) {
				this.ctrl_m_handler();
				this.ctrl_m_handler=null;//fire once
		}
	}
	,getHovering:function() {
		return this.hovering;
	}
	,onHovering:function(m) {
		this.hovering=m;
		this.trigger(m,{hovering:true});
	}
	,onCreateMarkup:function(obj,cb) {
		if (!obj.typedef || !obj.typedef.mark) {
			console.log(obj);
			throw "cannot create markup"
		}
		this.editing=null;

		obj.typedef.mark(obj, docfilestore.docOf ,function(err,newmarkup){
			this.markupsUnderCursor=newmarkup;
			this.trigger( this.markupsUnderCursor,{newly:true});
			if (cb) cb();
		}.bind(this));
	}
})
module.exports=markupStore;