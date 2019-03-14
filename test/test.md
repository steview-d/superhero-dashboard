# JS Testing

This document details the testing that was completed on the JS elements of this project.

## JSHint

The 'data-vis.js' file was passed into JSHint to check for compatibility issues and errors.

It identified an issue with the use of default parameters being used within the remove_blanks() function. It stated:

> 'default parameters' is only available in ES6

[Can I Use ](https://caniuse.com/#search=ECMAScript%202015 "ES6") showed this was unlikely to be supported in IE11 and a quick test showed this to be the case with the following console error (along with the lack of anything rendering on the page)

>SCRIPT1006: Expected ')'\
>data-vis.js (77,47)

To fix, the use of default parameters was removed and I ensured all calls to this function passed in all arguments, which removed the error.

JSHint identified 4 instances of undefined variables, all used by external libraries.

There were no other issues.


The source data contains 743 objects. I confirmed all are imported correctly by checking the Gender Selection dropdown and confirming all 3 entries add up to this total.
Female: 207
Male: 534
Other: 2
Total: 743

I also used console log to count the total number of objects within the parent object, and confirmed this was also <a href="images/all.png" target="_blank">743</a>


### Custom Functions 

The source data file itself was obtained from [kaggle.com](https://www.kaggle.com/ "Kaggle") and was scraped from the [shdb](https://www.superherodb.com/ "shdb") in June 2017.

The data is stored in .csv format. Some records contained blank data where the value was unknown, and rather than filling this in with placeholder data I chose to filter out any blank data.

Other data, such as height and weight is stored as a string, an example being '6'2' // 188 cm' and this required converting to a format I could use.

The hero attributes, such as power, speed, etc were also stored as strings, and needed to be converted to an integer before use.

I created custom functions to help with the processing of this data, and they were tested in the following ways:

##### remove_blanks(group, value_to_remove)

This function was used to filter out blank values from the data prior to displaying it. The function takes 2 parameters, the group to filter, and the value to filter out.

To test this function was filtering correctly and accurately I loaded the source csv file into a spreadsheet and for each cell that was either empty, or contained a value to signify null, I filtered out all other data, which left me with a count of how many blank or null entries there were to be filtered out for each section.

I then performed 2 tests to confirm the data was correct.

Test #1 was to manually count the entries for each chart type, where possible, based on the results in the browser window. The difference between this total, and the total objects (743) would need to match to show the blanks were being filtered correctly. These were all correct.

Test #2 involved adding a console.log to the script after each chart is drawn, which outputs the number of objects displayed for that particular chart. Again, this number should be the difference between the 743 total, and the number of blanks. These too were all correct.


| Key         |# Blanks|# w/Data|Total |
|-------------|------- |--------|------|
|Intelligence |78      |665     |<a href="images/int.png" target="_blank">743</a>|
|Strength     |78      |665     |<a href="images/str.png" target="_blank">743</a>|
|Speed        |78      |665     |<a href="images/spe.png" target="_blank">743</a>|
|Durability   |78      |665     |<a href="images/dur.png" target="_blank">743</a>|
|Power        |78      |665     |<a href="images/pow.png" target="_blank">743</a>|
|Combat       |78      |665     |<a href="images/com.png" target="_blank">743</a>|
|Alter Ego's  |0       |743     |<a href="images/alter_egos.png" target="_blank">743</a>|
|Creator      |8       |735     |<a href="images/creator.png" target="_blank">743</a>|
|Alignment    |6       |737     |<a href="images/alignment.png" target="_blank">743</a>|
|Gender       |0       |743     |<a href="images/gender.png" target="_blank">743</a>|
|Height       |214     |529     |<a href="images/height.png" target="_blank">743</a>|
|Weight       |234     |509     |<a href="images/weight.png" target="_blank">743</a>|
|Eye Color    |172     |571     |<a href="images/eyes.png" target="_blank">743</a>|
|Hair Color   |172     |571     |<a href="images/hair.png" target="_blank">743</a>|


##### hero_attr_to_integer(hero_attr)

This function was used to iterate through all the hero attributes which were stored as strings and store them in a new variable of the same name but in lowercase and as an integer.

The argument is just an array of strings containing the names of the attributes to convert (intelligence, strength, etc).

The fact the line chart displayed correctly was enough to show the strings had been converted to integers but as an additional check I again logged the result of the function to the console to further confirmation. This can be seen <a href="images/hero_attr.png" target="_blank">here</a>.

##### height_weight_conversion(key, firstIndex, lastIndex)

This function was used to convert the height and weight values into an integer that could be used. The data in the csv was stored as '6'2 // 188 cm' for height and '200 lb // 90 kg' for weight. The function was written to pull just the cm and kg values as integers.

As with the hero_attr_to_integer() function, the fact the charts displayed was evidence enough the function worked but again the results were logged to the console for further confirmation, which can be seen <a href="images/hw_conv.png" target="_blank">here</a>.

### Misc Tests

By way of final checks to ensure the data was displayed correctly, I put the .csv source file into google sheets and set custom filters. I then applied the same filters to the project data in the browser and compared. Again, everything matched 100%.