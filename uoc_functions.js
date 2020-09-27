

module.exports = {
    //transforms the input string: javascript:doPla('20201','10.549','CAT');
    //to ['20201','10.549','CAT']
    extractParamsFromStr: function (str) {
        const regex = /'(.*?)'/mg;
        // const str = `javascript:doPla('20201','10.549','CAT');`;
        let m, matchesArr = [];

        while ((m = regex.exec(str)) !== null) {
            // This is necessary to avoid infinite loops with zero-width matches
            if (m.index === regex.lastIndex) {
                regex.lastIndex++;
            }

            // The result can be accessed through the `m`-variable.
            m.forEach((match, groupIndex) => {
                console.log(`Found match, group ${groupIndex}: ${match}`);
                if (groupIndex == 1) {
                    matchesArr.push(match);
                }
                // return match;
            });

        }
        return matchesArr;
    },


    doPla: function (any, codi, lang, x, y)
    // Obre la fitxa del pla docent d'una assignatura
    // any:  Any acadèmic. Ex: 20031
    // codi: Codi assignatura. Ex: 05.001
    // lang: Idioma. Ex: CAT
    // x,y:  dimensions de la finestra x i y
    {
        var nargs = new Number(arguments.length);
        var xdef = new String('750');
        var ydef = new String('450');
        if (nargs < 4) {
            x = new String(xdef);
            y = new String(ydef);
        }

        //var url="http://cv.uoc.edu/tren/trenacc/web/GATILLO.PLANDOCENTE?" + "any_academico="+ any + "&cod_asignatura="+codi+"&idioma="+lang+"&pagina=PD_PREV_SECRE";
        var url = "http://cv.uoc.edu/tren/trenacc/web/GAT_EXP.PLANDOCENTE?" + "any_academico=" + any + "&cod_asignatura=" + codi + "&idioma=" + lang + "&pagina=PD_PREV_SECRE&cache=S";
        return url;
        //  var messWin = window.open(url,getWinNm(),'width='+ x + ',height=' + y + ',menubar=yes,resizable=yes,scrollbars=yes,status=yes'); 
    }
};

