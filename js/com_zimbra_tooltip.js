/*
 * ***** BEGIN LICENSE BLOCK *****
 * Zimbra Collaboration Suite Server
 * Copyright (C) 2011, 2012, 2013, 2014, 2016 Synacor, Inc.
 *
 * The contents of this file are subject to the Common Public Attribution License Version 1.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at: https://www.zimbra.com/license
 * The License is based on the Mozilla Public License Version 1.1 but Sections 14 and 15
 * have been added to cover use of software over a computer network and provide for limited attribution
 * for the Original Developer. In addition, Exhibit A has been modified to be consistent with Exhibit B.
 *
 * Software distributed under the License is distributed on an "AS IS" basis,
 * WITHOUT WARRANTY OF ANY KIND, either express or implied.
 * See the License for the specific language governing rights and limitations under the License.
 * The Original Code is Zimbra Open Source Web Client.
 * The Initial Developer of the Original Code is Zimbra, Inc.  All rights to the Original Code were
 * transferred by Zimbra, Inc. to Synacor, Inc. on September 14, 2015.
 *
 * All portions of the code are Copyright (C) 2011, 2012, 2013, 2014, 2016 Synacor, Inc. All Rights Reserved.
 * ***** END LICENSE BLOCK *****
 */

if(window.console && window.console.log) {
    window.console.log("Starting loading com_zimbra_helptooltip.js")
}

if(ZaSettings && ZaSettings.EnabledZimlet["com_zimbra_tooltip"]){

if(XFormItem) {
    XFormItem.prototype.helpTooltip = true;

    XFormItem.prototype.showHelpTooltip =
    function (event) {
        var dwtEv = new DwtUiEvent(true);
        dwtEv.setFromDhtmlEvent(event);
        var content = this.getInheritedProperty("helpTooltipContent");
        if (!content) {
            var attributeName = this.getInheritedProperty("attributeName");
            if(!attributeName) {
                attributeName = this.getRefPath();
            }

            if(!attributeName) {
                return;
            }

            var findSlash = attributeName.lastIndexOf("/");
            if(findSlash != -1) {
               attributeName = attributeName.substring(findSlash + 1); //exclude reverse slash
            }

            content = attributeName;
        }

        if(!content)
            return;

        this._helpToolTipExt = new ZaHelpToolTipAdminExtension();
        this._helpToolTipExt.handleHover(dwtEv.docX, dwtEv.docY, content);
    }

    XFormItem.prototype.hideHelpTooltip =
    function (event) {
        if(!this._helpToolTipExt)
           return;

        this._helpToolTipExt.hoverOut();
    }
}

}

ZaHelpToolTipAdminExtension = function() {
};

ZaHelpToolTipAdminExtension.prototype.handleHover =
function(x, y, attributeName) {
    this.hoverOver = true;
    var shell = DwtShell.getShell(window);
    var tooltip = shell.getToolTip();
    tooltip.setContent("<div id=\"ZaHelpToolTipAdminExtension\"></div>", true);
    this.x = x;
    this.y = y;
    this.tooltip = tooltip;
    Dwt.setHandler(tooltip._div, DwtEvent.ONMOUSEOUT, AjxCallback.simpleClosure(this.hoverOut, this));
    this.canvas =   document.getElementById("ZaHelpToolTipAdminExtension");
	this.slideShow = new ZaToolTipView(this, this.canvas, attributeName);
    tooltip.popup(this.x, this.y, true);
}

ZaHelpToolTipAdminExtension.prototype.redraw =
function() {
    if(!this.tooltip)
        return;
    if(!this.x)
        return;
    if(!this.y)
        return;
    this.tooltip.popup(this.x, this.y, true);
}

ZaHelpToolTipAdminExtension.prototype.hoverOut =
function() {
	if(!this.tooltip) {	return;	}

	this._hoverOver =  false;
	this.tooltip._poppedUp = false;//makes the tooltip sticky
	setTimeout(AjxCallback.simpleClosure(this.popDownIfMouseNotOnSlide, this), 700);
}

ZaHelpToolTipAdminExtension.prototype.popDownIfMouseNotOnSlide =
function() {
    if(this._hoverOver) {
        return;
    } else if(this.slideShow && this.slideShow.isMouseOverTooltip) {
        return;
	} else if(this.tooltip) {
        this.tooltip._poppedUp = true;//makes the tooltip non-sticky
        this.tooltip.popdown();
    }
}

if(window.console && window.console.log) {
    window.console.log("loaded com_zimbra_helptooltip.js")
}
