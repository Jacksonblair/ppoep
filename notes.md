# PPOEP process
* Index has list of user-submitted mtx combinations
* Index has display of available mtx
    - Categorized by usage (weapon, armour, back attach, character fx, full sets)
    - Each category is a tab menu.
        - List of armor categorized by set (chaos, frost, vampire, etc), links to show page
        - List of weapon categorized by set, which drops down to weapon type
        - List of back attach categorized by set
        - List of character fx categorized by set
        - List of complete themed sets

    
RESTFUL ROUTING

NAME        PATH            HTTP VERB       PURPOSE
===============================================
INDEX       /mtx           GET              List all mtx
NEW         /mtx/new       GET              Show new mtx form
CREATE      /mtx           POST             Create a new mtx, then redirect somewhere
SHOW        /mtx/:id       GET             Show info about one specific mtx
EDIT        /mtx/:id/edit  GET             Show edit form for one mtx
UPDATE      /mtx/:id       PUT             Update a particular mtx, then redirect somewhere
DESTROY     /mtx/:id       DELETE          Delete a particular mtx, then redirect somewhere







# PRETTY POE PRINCESS LOG

* Installed Express and ejs.
* Made first template
* Added partials dir. 
* Made header and footer partials.
* Made 'mtx/new' view
* Setup NEW route for mtx
* Setup CREATE route for mtx
* Set up create route to add submtx to DB
* Setup SHOW route for mtx
* Set up user submitted mtx schema "Submtx"
* Pass submtx database objects to /index/mtx view on GET
* Add SHOW route
* Added seedDB function
* Added comment 