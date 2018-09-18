/**
 *
 * htmlParser改造自: https://github.com/blowsie/Pure-JavaScript-HTML5-Parser
 *
 * author: Di (微信小程序开发工程师)
 * organization: WeAppDev(微信小程序开发论坛)(http://weappdev.com)
 *               垂直微信小程序开发交流社区
 *
 * github地址: https://github.com/icindy/wxParse
 *
 * for: 微信小程序富文本解析
 * detail : http://weappdev.com/t/wxparse-alpha0-1-html-markdown/184
 */
// Regular Expressions for parsing tags and attributes
var startTag = /^<([-A-Za-z0-9_]+)((?:\s+[a-zA-Z_:][-a-zA-Z0-9_:.]*(?:\s*=\s*(?:(?:"[^"]*")|(?:'[^']*')|[^>\s]+))?)*)\s*(\/?)>/,
    endTag = /^<\/([-A-Za-z0-9_]+)[^>]*>/,
    attr = /([a-zA-Z_:][-a-zA-Z0-9_:.]*)(?:\s*=\s*(?:(?:"((?:\\.|[^"])*)")|(?:'((?:\\.|[^'])*)')|([^>\s]+)))?/g;

// Empty Elements - HTML 5
var empty = makeMap("area,base,basefont,br,col,frame,hr,img,input,link,meta,param,embed,command,keygen,source,track,wbr");

// Block Elements - HTML 5
var block = makeMap("a,address,code,article,applet,aside,audio,blockquote,button,canvas,center,dd,del,dir,div,dl,dt,fieldset,figcaption,figure,footer,form,frameset,h1,h2,h3,h4,h5,h6,header,hgroup,hr,iframe,ins,isindex,li,map,menu,noframes,noscript,object,ol,output,p,pre,section,script,table,tbody,td,tfoot,th,thead,tr,ul,video");

// Inline Elements - HTML 5
var inline = makeMap("abbr,acronym,applet,b,basefont,bdo,big,br,button,cite,del,dfn,em,font,i,iframe,img,input,ins,kbd,label,map,object,q,s,samp,script,select,small,span,strike,strong,sub,sup,textarea,tt,u,var");

// Elements that you can, intentionally, leave open
// (and which close themselves)
var closeSelf = makeMap("colgroup,dd,dt,li,options,p,td,tfoot,th,thead,tr");

// Attributes that have their values filled in disabled="disabled"
var fillAttrs = makeMap("checked,compact,declare,defer,disabled,ismap,multiple,nohref,noresize,noshade,nowrap,readonly,selected");

// Special Elements (can contain anything)
var special = makeMap("wxxxcode-style,script,style,view,scroll-view,block");

function HTMLParser (html, handler) {
    var index, chars, match, stack = [], last = html;
    stack.last = function () {
        return this[this.length - 1];
    };
    // console.log(html, stack, "wxDiscode11");
    while (html) {
        chars = true;
        // console.log(html, stack, "wxDiscode111");
        // Make sure we're not in a script or style element
        // 确保我们不在脚本或样式元素中
        if (!stack.last() || !special[stack.last()]) {
            // console.log(html, stack, "wxDiscode1111");
            // Comment
            if (html.indexOf("<!--") == 0) {
                // console.log(html, stack, "wxDiscode11111");
                index = html.indexOf("-->");
                if (index >= 0) {
                    if (handler.comment)
                        handler.comment(html.substring(4, index));
                    html = html.substring(index + 3);
                    chars = false;
                }
                // end tag
            } else if (html.indexOf("</") == 0) {
                // console.log(html, stack, "wxDiscode11112");
                match = html.match(endTag);
                if (match) {
                    html = html.substring(match[0].length);
                    match[0].replace(endTag, parseEndTag);
                    chars = false;
                }

                // start tag
            } else if (html.indexOf("<") == 0) {
                // console.log(html, stack, startTag, "wxDiscode11113");
                match = html.match(startTag);
                if (match) {
                    // console.log(html, stack, match, "wxDiscode111131");
                    html = html.substring(match[0].length);
                    // console.log(html, stack, match, "wxDiscode111132");
                    match[0].replace(startTag, parseStartTag);
                    // console.log(html, stack, match, "wxDiscode111133");
                    chars = false;
                }
            }
            // console.log(html, stack, "wxDiscode1112");
            if (chars) {
                index = html.indexOf("<");
                var text = ''
                while (index === 0) {
                    text += "<";
                    html = html.substring(1);
                    index = html.indexOf("<");
                }
                text += index < 0 ? html : html.substring(0, index);
                html = index < 0 ? "" : html.substring(index);

                if (handler.chars)
                    handler.chars(text);
            }
        } else {
            // console.log(html, stack, "wxDiscode1113");
            html = html.replace(new RegExp("([\\s\\S]*?)<\/" + stack.last() + "[^>]*>"), function (all, text) {
                text = text.replace(/<!--([\s\S]*?)-->|<!\[CDATA\[([\s\S]*?)]]>/g, "$1$2");
                if (handler.chars)
                    handler.chars(text);
                return "";
            });
            // console.log(html, stack, "wxDiscode1114");
            parseEndTag("", stack.last());
        }
        // console.log(html, stack, "wxDiscode112");
        if (html == last)
            throw "Parse Error: " + html;
        last = html;
    }
    // console.log(html, "wxDiscode12");
    // Clean up any remaining tags
    parseEndTag();

    function parseStartTag (tag, tagName, rest, unary) {
        // console.log(tag, tagName, rest, unary, "wxDiscode1111321");
        tagName = tagName.toLowerCase();
        // console.log(tag, tagName, rest, unary, "wxDiscode1111322");
        if (block[tagName]) {
            // console.log(tag, tagName, rest, unary, "wxDiscode1111323");
            while (stack.last() && inline[stack.last()]) {
                parseEndTag("", stack.last());
            }
            // console.log(tag, tagName, rest, unary, "wxDiscode1111324");
        }
        // console.log(tag, tagName, rest, unary, "wxDiscode1111325");
        if (closeSelf[tagName] && stack.last() == tagName) {
            parseEndTag("", tagName);
        }
        // console.log(tag, tagName, rest, unary, "wxDiscode1111326");
        unary = empty[tagName] || !!unary;

        if (!unary)
            stack.push(tagName);

        if (handler.start) {
            // console.log(tag, tagName, rest, unary, "wxDiscode11113261");
            var attrs = [];
            rest.replace(attr, function (match, name) {
                var value = arguments[2] ? arguments[2] :
                    arguments[3] ? arguments[3] :
                        arguments[4] ? arguments[4] :
                            fillAttrs[name] ? name : "";

                attrs.push({
                    name: name,
                    value: value,
                    escaped: value.replace(/(^|[^\\])"/g, '$1\\\"') //"
                });
            });
            // console.log(tag, tagName, rest, unary, "wxDiscode11113262");
            if (handler.start) {
                handler.start(tagName, attrs, unary);
            }
            // console.log(tag, tagName, rest, unary, "wxDiscode11113263");
        }
        // console.log(tag, tagName, rest, unary, "wxDiscode1111327");
    }

    function parseEndTag (tag, tagName) {
        // If no tag name is provided, clean shop
        if (!tagName)
            var pos = 0;

        // Find the closest opened tag of the same type
        else {
            tagName = tagName.toLowerCase();
            for (var pos = stack.length - 1; pos >= 0; pos--)
                if (stack[pos] == tagName)
                    break;
        }
        if (pos >= 0) {
            // Close all the open elements, up the stack
            // 关闭堆栈中的所有打开元素
            for (var i = stack.length - 1; i >= pos; i--)
                if (handler.end)
                    handler.end(stack[i]);

            // Remove the open elements from the stack
            // 从堆栈中删除打开的元素
            stack.length = pos;
        }
    }
};


function makeMap (str) {
    var obj = {}, items = str.split(",");
    for (var i = 0; i < items.length; i++)
        obj[items[i]] = true;
    return obj;
}

module.exports = HTMLParser;
