﻿---
SidebarGroup: index-metadata-views
Catalog: cronosql.metadata
title: Crono$UnicodeChars
Autogenerated: true
---

# Crono$UnicodeChars



Devuelve el listado completo de caracteres UNICODE, incluyendo su nombre y tipología. 

Esta información está generada a partir del fichero [UnicodeData.txt](http://www.unicode.org/Public/UNIDATA/UnicodeData.txt) proporcionado por Unicode Consortium.

La siguiente consulta muestra 100 caracteres UNICODE.


``` 
select top 100 *
from Crono$UnicodeChars
where codepoint between 65 and 90 or [Group]='Emoji' 
order by 1
```

El resultado de esta consulta es:

|CodePoint |Hex    |Char |Group           |Name                      |
|----------|-------|-----|----------------|--------------------------|
|65        |000041 |A    |UppercaseLetter |LATIN CAPITAL LETTER A    |
|66        |000042 |B    |UppercaseLetter |LATIN CAPITAL LETTER B    |
|67        |000043 |C    |UppercaseLetter |LATIN CAPITAL LETTER C    |
|68        |000044 |D    |UppercaseLetter |LATIN CAPITAL LETTER D    |
|69        |000045 |E    |UppercaseLetter |LATIN CAPITAL LETTER E    |
|70        |000046 |F    |UppercaseLetter |LATIN CAPITAL LETTER F    |
|71        |000047 |G    |UppercaseLetter |LATIN CAPITAL LETTER G    |
|72        |000048 |H    |UppercaseLetter |LATIN CAPITAL LETTER H    |
|73        |000049 |I    |UppercaseLetter |LATIN CAPITAL LETTER I    |
|74        |00004A |J    |UppercaseLetter |LATIN CAPITAL LETTER J    |
|75        |00004B |K    |UppercaseLetter |LATIN CAPITAL LETTER K    |
|76        |00004C |L    |UppercaseLetter |LATIN CAPITAL LETTER L    |
|77        |00004D |M    |UppercaseLetter |LATIN CAPITAL LETTER M    |
|78        |00004E |N    |UppercaseLetter |LATIN CAPITAL LETTER N    |
|79        |00004F |O    |UppercaseLetter |LATIN CAPITAL LETTER O    |
|80        |000050 |P    |UppercaseLetter |LATIN CAPITAL LETTER P    |
|81        |000051 |Q    |UppercaseLetter |LATIN CAPITAL LETTER Q    |
|82        |000052 |R    |UppercaseLetter |LATIN CAPITAL LETTER R    |
|83        |000053 |S    |UppercaseLetter |LATIN CAPITAL LETTER S    |
|84        |000054 |T    |UppercaseLetter |LATIN CAPITAL LETTER T    |
|85        |000055 |U    |UppercaseLetter |LATIN CAPITAL LETTER U    |
|86        |000056 |V    |UppercaseLetter |LATIN CAPITAL LETTER V    |
|87        |000057 |W    |UppercaseLetter |LATIN CAPITAL LETTER W    |
|88        |000058 |X    |UppercaseLetter |LATIN CAPITAL LETTER X    |
|89        |000059 |Y    |UppercaseLetter |LATIN CAPITAL LETTER Y    |
|90        |00005A |Z    |UppercaseLetter |LATIN CAPITAL LETTER Z    |
|169       |0000A9 |©    |emoji           |COPYRIGHT                 |
|174       |0000AE |®    |emoji           |REGISTERED                |
|8252      |00203C |‼    |emoji           |DOUBLE EXCLAMATION MARK   |
|8265      |002049 |⁉    |emoji           |EXCLAMATION QUESTION MARK |
|8482      |002122 |™    |emoji           |TRADE MARK                |
|8505      |002139 |ℹ    |emoji           |INFORMATION               |
|8596      |002194 |↔    |emoji           |LEFT-RIGHT ARROW          |
|8597      |002195 |↕    |emoji           |UP-DOWN ARROW             |
|8598      |002196 |↖    |emoji           |UP-LEFT ARROW             |
|8599      |002197 |↗    |emoji           |UP-RIGHT ARROW            |
|8600      |002198 |↘    |emoji           |DOWN-RIGHT ARROW          |
|8601      |002199 |↙    |emoji           |DOWN-LEFT ARROW           |
|8617      |0021A9 |↩    |emoji           |RIGHT ARROW CURVING LEFT  |
|8618      |0021AA |↪    |emoji           |LEFT ARROW CURVING RIGHT  |
|8986      |00231A |⌚    |emoji           |WATCH                     |
|8987      |00231B |⌛    |emoji           |HOURGLASS DONE            |
|9000      |002328 |⌨    |emoji           |KEYBOARD                  |
|9167      |0023CF |⏏    |emoji           |EJECT BUTTON              |
|9193      |0023E9 |⏩    |emoji           |FAST-FORWARD BUTTON       |
|9194      |0023EA |⏪    |emoji           |FAST REVERSE BUTTON       |
|9195      |0023EB |⏫    |emoji           |FAST UP BUTTON            |
|9196      |0023EC |⏬    |emoji           |FAST DOWN BUTTON          |
|9197      |0023ED |⏭    |emoji           |NEXT TRACK BUTTON         |
|9198      |0023EE |⏮    |emoji           |LAST TRACK BUTTON         |
|9199      |0023EF |⏯    |emoji           |PLAY OR PAUSE BUTTON      |
|9200      |0023F0 |⏰    |emoji           |ALARM CLOCK               |
|9201      |0023F1 |⏱    |emoji           |STOPWATCH                 |
|9202      |0023F2 |⏲    |emoji           |TIMER CLOCK               |
|9203      |0023F3 |⏳    |emoji           |HOURGLASS NOT DONE        |
|9208      |0023F8 |⏸    |emoji           |PAUSE BUTTON              |
|9209      |0023F9 |⏹    |emoji           |STOP BUTTON               |
|9210      |0023FA |⏺    |emoji           |RECORD BUTTON             |
|9410      |0024C2 |Ⓜ    |emoji           |CIRCLED M                 |
|9642      |0025AA |▪    |emoji           |BLACK SMALL SQUARE        |
|9643      |0025AB |▫    |emoji           |WHITE SMALL SQUARE        |
|9654      |0025B6 |▶    |emoji           |PLAY BUTTON               |
|9664      |0025C0 |◀    |emoji           |REVERSE BUTTON            |
|9723      |0025FB |◻    |emoji           |WHITE MEDIUM SQUARE       |
|9724      |0025FC |◼    |emoji           |BLACK MEDIUM SQUARE       |
|9725      |0025FD |◽    |emoji           |WHITE MEDIUM-SMALL SQUARE |
|9726      |0025FE |◾    |emoji           |BLACK MEDIUM-SMALL SQUARE |
|9728      |002600 |☀    |emoji           |SUN                       |
|9729      |002601 |☁    |emoji           |CLOUD                     |
|9730      |002602 |☂    |emoji           |UMBRELLA                  |
|9731      |002603 |☃    |emoji           |SNOWMAN                   |
|9732      |002604 |☄    |emoji           |COMET                     |
|9742      |00260E |☎    |emoji           |TELEPHONE                 |
|9745      |002611 |☑    |emoji           |CHECK BOX WITH CHECK      |
|9748      |002614 |☔    |emoji           |UMBRELLA WITH RAIN DROPS  |
|9749      |002615 |☕    |emoji           |HOT BEVERAGE              |
|9752      |002618 |☘    |emoji           |SHAMROCK                  |
|9757      |00261D |☝    |emoji           |INDEX POINTING UP         |
|9760      |002620 |☠    |emoji           |SKULL AND CROSSBONES      |
|9762      |002622 |☢    |emoji           |RADIOACTIVE               |
|9763      |002623 |☣    |emoji           |BIOHAZARD                 |
|9766      |002626 |☦    |emoji           |ORTHODOX CROSS            |
|9770      |00262A |☪    |emoji           |STAR AND CRESCENT         |
|9774      |00262E |☮    |emoji           |PEACE SYMBOL              |
|9775      |00262F |☯    |emoji           |YIN YANG                  |
|9784      |002638 |☸    |emoji           |WHEEL OF DHARMA           |
|9785      |002639 |☹    |emoji           |FROWNING FACE             |
|9786      |00263A |☺    |emoji           |SMILING FACE              |
|9792      |002640 |♀    |emoji           |FEMALE SIGN               |
|9794      |002642 |♂    |emoji           |MALE SIGN                 |
|9800      |002648 |♈    |emoji           |ARIES                     |
|9801      |002649 |♉    |emoji           |TAURUS                    |
|9802      |00264A |♊    |emoji           |GEMINI                    |
|9803      |00264B |♋    |emoji           |CANCER                    |
|9804      |00264C |♌    |emoji           |LEO                       |
|9805      |00264D |♍    |emoji           |VIRGO                     |
|9806      |00264E |♎    |emoji           |LIBRA                     |
|9807      |00264F |♏    |emoji           |SCORPIO                   |
|9808      |002650 |♐    |emoji           |SAGITTARIUS               |
|9809      |002651 |♑    |emoji           |CAPRICORN                 |



## Comentarios

Esta vista es similar a `Crono$UnicodeTable`.

La vista `Crono$Emojis` devuelve únicamente caracteres emojis con información adicional.