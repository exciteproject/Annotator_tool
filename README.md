# Annotator Tool One:

This is a ** "Reference String Extraction"**\n
Our assessor tags start and end tokens for each reference strings.\n
The output will be like this:\n

```javascript
<ref>1971: Theorie der Subkultur. Frankfurt a.M.</ref>
<ref>1976: Rosa Luxemburg im botanischen Garten, gesungen im Kulturzelt aufdem Pfingst­
kongress, Booklet zur Kassette „Pfingstkongreß 1976“, Sozialistisches Bürol985</ref>
<ref>1978/1982: Zur Geschichte der Zukunft. Zukunftsforschung und Sozialismus, Band 1.
Frankfurt a.M.</ref>
```


# AnnotatorToolTwo

This is a **"Meta-data Extraction"**\n
This annotator gives our assessors the possibility to tag some metadata in each reference string in a paper\n
Meta datas like: author, year, title, container, editorial board and others , ...\n
The output will be like this:\n
```javascript
<author><surname>er</surname>, W./Gürtler, <given-names>M.</given-names></author> (<year>2006</year>)
<article-title>: “Performance Evaluation, Portfolio Selection, and HARA Utility”</article-title>, 
<source>European Journal of Finance</source>, Vol. <volume>18</volume>, pp. 
<fpage>649</fpage>-<lpage>669</lpage>. - Breuer, W./Gürtler, M./Schuhmacher,
```