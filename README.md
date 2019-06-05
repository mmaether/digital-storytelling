# Digital Storytelling

## About

The about section is to provide information about the story. All stories require a title, at least one creator, and the date. There is an optional subtitle field available in case it’s needed. 

### Title

This is just the title of the story. It’s important to include a title, not only for identification purposes, but also because of the page’s layout. The title of the page is automatically included as the title of the web page, so please make sure to include it.

### Creators

Oftentimes stories are a collaboration of people, and sometimes it’s the sole effort of one person. To properly give credit to each person involved, make sure to include information about every creator that was involved. Each creator field needs their name and the type of their contribution. The following is a list of creator types available for assignment: 
- Author – this creator wrote the story. 
- Designer – this creator did the graphics, illustrations, and/or anything visual for the story. 
- Audio – this creator composed the audio. 
- Creator – this person did all of the work on the project.
- Other – if there are any other fields not mentioned that the creator would like to be credited for, they can choose the “other” type. 
Every creator is also given proper credit in the HTML itself in `<meta>` tags.

### Date

Exactly what it says, just enter the date that the story was created. There is a field for the month, the day, and the year.

### Sources

Although the law is different for each country, it is usually illegal to use another person’s work improperly. Most often you’ll need to ask permission from the creator to use their work and then give them the proper credit. To learn more about proper use, you’ll need to research about different Internet copyright laws that would affect you.

Once you are able to use a source, you’ll need to cite it. In the source section, you’re allowed to enter as many sources as you’d like. The following are required:

- `source_type`: Choose whether the source is an audio file, an image, or anything that was written. 
- `source_title`: The title of the source. This can be the name of the song (e.g. “Lucy in the Sky with Diamonds”), the name of an image used (e.g. “Starry Night”), the name of the book/poem/excerpt/website (e.g. “The Road Not Taken”), or anything that would identify the source. 
- `source_creator`: The person/people who created the work. This can be a band, an author, a designer, or anyone else.

There are also a few attributes that are optional:

- `source_link`: If the source can be found online, you can enter its URL. If included, the source will be presented as a hyperlink on the page. 
- `source_notes`: This section is intended for any extra information that could pertain to the source. If the source creator requires a certain message to be included with the use of their content, it can be added here.

All of the sources will be added to the end of the story. 

Side note: There are many royalty free websites that gives permission to everyone to use their images or audio without asking permission. If in doubt, it may be worth to check some of these sites out. One of my favorites is [stock.xchnge](http://sxc.hu/).

### Include title page

There is an attribute for the `<about>` tag that asks if the user wants to include the title page on the website. This will automatically make the first section of the story include the title and the creators. It will not include the sources or the date. This is primarily to make it easy to include title pages for the creators. However, title pages aren’t required. If you either don’t want to include a title page or you’d rather create your own custom title page as a scene, you may do so. 

## Overall Style

This section is intended for any content that would be applied to the whole page.

### Overall font
You can choose certain styles to the font that would apply for the whole story. The options are: 

- `background_color`: This will be the overall background color for the whole story. The default color is set to white.
- `font_color`: This sets the overall font color for all of the text. The default color is black. 
- `font_family`: Choose the default font style for the whole story. If it isn’t chosen, the default font will be Times New Roman. 
- `font_size`: You can choose which size font you want all of the text to be. 

These attributes will be overwritten if any individual elements have different values. For example, if the overall font color is chosen to be black, but one single text element in the story is set to be yellow, that one element will be yellow while the rest of the story is black.

To find out more about these styles, such as which colors or font families are available, please check out the Style section of this document. 

### Audio

It’s possible to add an audio file to your story. Currently browsers are restricted to using certain formats, and unfortunately different browsers support different formats. To see a chart of which format each browser supports, take a look at the W3C audio page. To ensure that every browser can play the audio file, you need to include either: 
- 1 MP3 file and 1 OGG file
- 1 MP3 file and 1 WAV file

If you only have one format, you’ll need to convert it to another format. There are many online converters that are free; just do a quick search. One suitable audio converter is media.io.

There are also a few options to customize the audio file.

- `autoplay`: Will the audio file play as soon as the page loads? 
- `loop`: Once the audio file plays once, will it repeat itself or will it be finished entirely? 
- `href`: This is the location of the audio file, e.g. `audio/audio-track.mp3`

Currently you can only add one audio file for the whole story. 

### Favicon

Favicons are icons that identify the website graphically and that appear in multiple locations, such as the address bar, the links bar, as a bookmark, and more.
 
Favicons are 16 x 16 pixels. These are the options to include a favicon:

- `file_format`: You can choose from a few formats. The most recognized format is `.ico`, but there is also support of `.gif`, mostly for animated favicons.
- `href`: The location of the favicon. For example: `images/favicon.gif` or `favicon.ico`. 

## Styles

This project has been designed to make it simple to create a digital story. A large portion of digital stories is how it actually looks, so it’s necessary to include styling options. There are many, many style rules that most people won’t use, and in an effort to make this project as direct as possible, I’m including only a handful of styling choices to make it easy for the user. For most users, the following options will be enough, but if for some reason you need to include a different field, I would highly recommend researching CSS and hard code what you would like. 

### Colors

There are 147 preset colors to choose from. These are colors that are supported by every browser as per W3C recommendations. Each font color has its own CSS class so it can be applied to any element. For a complete list of colors available, you can check out W3C’s color names page. These colors can be used for both the font color and as a background color.

### Font Families

There are many, many font families available to use for websites, although many of them aren’t supported for all browsers. To ensure every browser will view the site properly, I’ve limited the font selection to font families that are viewable for every browser. It includes 20 sans-serif, 17 serif, 6 monospace, 4 fantasy, and 1 script. 

Just like with the colors, each font family is its own class and can be added to any element. For the full list of fonts used, check out CSS Font Stack.

#### Sans-serif

- Arial
- Arial Black
- Arial Narrow
- Arial Rounded MT Bold
- Avant Garde (Unavailable)
- Calibri
- Candara
- Century Gothic
- Franklin Gothic Medium
- Futura
- Geneva (Unavailable)
- Gill Sans
- Helvetica (Unavailable)
- Impact
- Lucida Grande
- Optima (Unavailable)
- Segoe UI
- Tahoma
- Trebuchet MS
- Verdana

#### Serif

- Baskerville
- Big Caslon (Unavailable)
- Bodoni MT
- Book Antiqua
- Calisto MT
- Cambria
- Didot (Unavailable)
- Garamond
- Georgia
- Goudy Old Style
- Hoefler Text (Unavailable)
- Lucida Bright
- Palatino
- Perpetua
- Rockwell
- Rockwell Extra Bold
- Times New Roman

#### Monospace

- Andale Mono (unavailable)
- Consolas
- Courier New
- Lucida Console
- Lucida Sans Typewriter
- Monaco (unavailable)

#### Fantasy

- Comic Sans
- Copperplate
- Papyrus
Script
- Brush Script MT

### Font Size

You can change the font for the entire story and for every text element. The font size attribute gives users the choice of entering values from `9px` to `100px`. This is to ensure that proper values will be added properly.

### Classes

Don’t like how I’m limiting your style options? Well create your own rules, then. If for any reason you want to stylize a section differently, either with a different font size, font family, or color that you can’t choose, or maybe something entirely different, then you’ll need to do a little bit more work to make it happen. You will need to know how to write a bit of CSS code. For support, I recommend checking out W3C’s CSS tutorial page, or nearly any other CSS tutorial website; there are a lot.

First, you’ll need to open `customizedStyle.css` in any text editor. This style sheet is intended for any user created rules to protect the integrity of `style.css`. Create your own class after the notes. If you need help, there are some notes and sources to check out on that page, or just research it yourself. Class names start with a period and don’t have any spaces. An example would be `.classExample1`. 

After creating your class, go to the XML file and find any element that has a class attribute, for example `<text>`. In the `class` attribute, enter the class name you just created but without the period. In this example, it would be `classExample1`. If you want to include a few classes, just enter a space between each one, and every class will be added. This is what it would look like: 

```
<text class=”classExample1 classExample2”>
    <text_content>Type any text here.</text_content>
</text>
```

## Positioning

You are able to create a text or image element and then place it wherever you would like on the page. First open the `<positioning>` tag. For each direction that you want to alter, just add a new `<position>` tag. Here are the required attributes:

- `direction`: Which direction do you want to push the element? The choices are `left`, `right`, `top`, and `bottom`. 
- `value_in_pixels`: This is how far the element will be pushed. The larger the number, the greater the distance.

The `<positioning>` grouping allows for multiple directions, so if you’d like to move the element `20px` down and `40px` right, it would look like this:

```
<positioning>
	<position direction=”down” value_in_pixels=”20px”/>
	<position direction=”right” value_in_pixels=”40px”/>
</positioning>
```

Note: if you are using a scroll animation, it will make positioning more difficult. If you have it flying left, you need to use a right position. 

Text shadow
You can also add a couple types of text shadows to your text element. The designs are from [Design Shack](https://designshack.net/articles/css/12-fun-css-text-shadows-you-can-copy-and-paste/). They are:
 
- Basic shadow,
- Letterpress, 
- Hard shadow, 
- Double shadow, 
- Down and distant, 
- Close and heavy, 
- Glowing, 
- Multiple light sources, 
- Soft emboss.

## Story

Now we’re on to the bulk of the documentation. The story section will hold the rest of the story. 

### Scenes

Each story is composed of many scenes. Although it’s up to each storyteller to define the length of their own scene, these scenes can broadly be defined as a grouping of texts and images. A scene could potentially be the equivalent of one comic book frame, or even multiple. It’s completely up to the discrepancy of the content creator. Each scene has a grouping for images and text. Here is a general layout: 

If desired, you can change the style of every element within scene tag by changing its attributes. Each scene has the following attributes:

- Background color
- Font color
- Text shadow
- Font Family
- Font size
- Height – If for any reason you’d like to change the height of the scene div, you can manually enter its height in pixels.

If you would like to find out more about these attributes, please take a look at the styles section.

### Text

Every scene has a "texts" group that holds every text element used for that particular scene. Any text that you want to appear on the page will be included in the `<text_content>` tag. There are a handful of attributes that can be changed in the `<text>` tag: 
- background color
- font color
- font size
- font family
- class
- text shadow
- balloon style: There are a handful of predefined balloon styles that you can add easily, including a speech bubble and a thought bubble. The direction indicates which direction the text is coming from. 

Each text element also has fields to change its location on the page and if it includes any scrolling animations. For more information about these, check out the Positioning and Scrolling Animations sections in this document. For more information about any of the style elements, take a look at the Styles section in this document.

### Images

Images are pretty similar to the text elements. Every image is placed in an `<images>` group that holds every image for that particular scene. 