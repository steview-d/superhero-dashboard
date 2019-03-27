# JS Testing

This document details the testing that was completed on the JS elements of this project.

### Code Quality

The 'data-vis.js' file was passed into JSHint to check for compatibility issues and errors.

It identified an issue with the use of default parameters being used within the remove_blanks() function. It stated:

> 'default parameters' is only available in ES6

[Can I Use ](https://caniuse.com/#search=ECMAScript%202015 "ES6") showed this was unlikely to be supported in IE11 and a quick test showed this to be the case with the following console error (along with the lack of anything rendering on the page)

>SCRIPT1006: Expected ')'\
>data-vis.js (77,47)

To fix, the use of default parameters was removed, and I ensured all calls to this function passed in all arguments, which removed the error.

JSHint identified 4 instances of undefined variables, however this is not an issue as they all refer to external libraries.

There were no other issues.


The source data contains 743 objects. I confirmed all are imported correctly by checking the Gender Selection dropdown and confirming all 3 entries add up to this total.
Female: 207
Male: 534
Other: 2
Total: 743

I also used console log to count the total number of objects within the parent object, and confirmed this [here](images/all.png).


### Custom Functions 

The source data file itself was obtained from [kaggle.com](https://www.kaggle.com/ "Kaggle") and was scraped from the [SHDB](https://www.superherodb.com/ "Super Hero Database") in June 2017.

The data is stored in .csv format. Some records contained blank data where the value was unknown, and rather than filling this in with placeholder data I chose to filter out any blank data. For more on this, see the final section of this document.

Other data, such as height and weight is stored as a string, an example being '6'2' // 188 cm' and this required converting to a format I could use.

The hero attributes, such as power, speed, etc were also stored as strings, and needed to be converted to an integer before use.

I created custom functions to help with the processing of this data, and they were tested in the following ways:

##### remove_blanks(group, value_to_remove)

This function was used to filter out blank values from the data prior to displaying it. The function takes 2 parameters, the group to filter, and the value to filter out.

To test this function was filtering correctly and accurately I loaded the source csv file into a spreadsheet and filtered out any non-empty or null values. This left me with a count of empty and null values that required filtering out of each section of the dataset.

With this information I was then able to perform 2 tests to confirm the data was correct.

Test #1 was to manually count the entries for each chart type, where possible, based on the results in the browser window. The difference between this total, and the total objects (743) would need to match to show the blanks were being filtered correctly. These were all correct.

Test #2 involved adding a console.log to the script after each chart is drawn, which outputs the number of objects displayed for that particular chart. Again, this number should be the difference between the 743 total, and the number of blanks. These too were all correct.


| Key         |# Blanks|# w/Data|Total |
|-------------|------- |--------|------|
|Intelligence |78      |665     |[743](images/int.png)|
|Strength     |78      |665     |[743](images/str.png)|
|Speed        |78      |665     |[743](images/spe.png)|
|Durability   |78      |665     |[743](images/dur.png)|
|Power        |78      |665     |[743](images/pow.png)|
|Combat       |78      |665     |[743](images/com.png)|
|Alter Ego's  |0       |743     |[743](images/alter_egos.png)|
|Creator      |8       |735     |[743](images/creator.png)|
|Alignment    |6       |737     |[743](images/alignment.png)|
|Gender       |0       |743     |[743](images/gender.png)|
|Height       |214     |529     |[743](images/height.png)|
|Weight       |234     |509     |[743](images/weight.png)|
|Eye Color    |172     |571     |[743](images/eyes.png)|
|Hair Color   |172     |571     |[743](images/hair.png)|


##### hero_attr_to_integer(hero_attr)

This function was used to iterate through all the hero attributes which were stored as strings and store them in a new variable of the same name but in lowercase and as an integer.

The argument is just an array of strings containing the names of the attributes to convert (intelligence, strength, etc).

The fact the line chart displayed correctly was enough to show the strings had been converted to integers but as an additional check I again logged the result of the function to the console to further confirmation. This can be seen [here](images/hero_attr.png).

##### height_weight_conversion(key, firstIndex, lastIndex)

This function was used to convert the height and weight values into an integer that could be used. The data in the csv was stored as '6'2 // 188 cm' for height and '200 lb // 90 kg' for weight. The function was written to pull just the cm and kg values as integers.

As with the hero_attr_to_integer() function, the fact the charts displayed was evidence enough the function worked but again the results were logged to the console for further confirmation, which can be seen [here](images/hw_conv.png).

### Misc Tests

By way of final checks to ensure the data was displayed correctly, I put the .csv source file into google sheets and set custom filters. I then applied the same filters to the project data in the browser and compared. Again, everything matched 100%.

### Handling blank data and its effects on the results as a whole

As mentioned already, the dataset contained a number of heroes with some blank data for certain attributes - usually height, weight, hair color, eye color, and to a lesser extent, their character attributes (speed, power, etc).

I decided against filling these blanks with placeholder data as this would ruin the data and make a lot of the comparisons useless. Instead, I used the function detailed above - remove_blanks() - to filter out this empty data.

Whilst I firmly believe this is the best way forward, it does mean on occasion the dashboard can end up displaying blank, or empty, data. Whilst this is rare, it is important to note it can happen, and is not a fault of the site itself, but rather a side effect of choosing to preserve the integrity of the original data.

In the most part, when there is data to be displayed, the site will filter out the empty data and display what it has. However, when the data has been filtered to such a level that all that remains for example, is 1 hero who has no data for height and weight, the charts for height and weight will show as empty.

This does also create another inconsistency in that sometimes it will appear that the data is displaying incorrectly, when it is not. I'll give an extreme example. With no filters selected, you can see at the bottom of the page, there are 14 heroes in the data set who were published by Image Comics. If this filter is selected, you can then look at alter egos and see a 12/2 split in favour of not having an alter ego. However, of the 14 heroes filtered, 12 have no data for height, weight, hair color, and eye color. When you look at these charts, they will only add up to 2, due to the 12 with no data being filtered out.

Again, this is intentional as it lets you compare the attribute spread for the heroes with data, rather than skewing the result with blank values. This way you can see, for example, 50% of the remaining heroes have blue eyes, and 50% have brown, rather than 7% for each and then showing an 86% slice for empty.

### jQuery Tests

jQuery is used in 2 areas of the site. Firstly, to reset the filters, and second to show/hide the individual sections. Both of these have been tested and work 100% and without errors.