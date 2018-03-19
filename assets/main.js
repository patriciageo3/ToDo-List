$(document).ready(function() {
    $list = $("#list-items");
    $list.html(localStorage.getItem("listItems"));
    
    let $editWindow = $("#modal");
    let $textArea = $("#edit-list-item");
    let $alertBox = $('#customisedAlert');
    let $cover1 = $(".cover").eq(0);
    let $cover2 = $(".cover").eq(1);
    let $ind;
    let $itemToMove;
    let timer;
    
    function cleanString(str) {
        let string = str.replace(/[^A-Za-z0-9]/ig, "");
        return string.toLowerCase();
    }

    function checkDuplicates(item, element) {
        let currentItem = cleanString(item);
        let existingItem = cleanString(element.textContent.replace("Edit...", ""));
        let test = (currentItem === existingItem) ? true : false;
       
        return test;
    }

    function itemTemplate(value) {
        return `<input class='checkbox' type='checkbox'><span>${value}</span><break></break><div class='functionality'><img src="./assets/pics/flag.png" title="Mark as important!"><p class='edit'>Edit... </p><a class='remove'><i class='fa fa-window-close' aria-hidden='true'></i></a></div><hr>`;
    }

    function updateListItem() {
        let newValue = $textArea.val();
        $list.children().each(function(index, elem) {             
            check = checkDuplicates(newValue, elem); 
            if (check) {
                return false; // get out of the loop if duplicate!
            }
        });
        
        if (check) {
            openAlert('You already have this TO-DO added: "' + newValue + '". Please try again.');           
        } else {
            $(".editMe").html(itemTemplate(newValue));
            hideModal();
            $cover1.css("display", "none");
            $(".editMe").removeClass("editMe");
            localStorage.setItem("listItems", $list.html());                   
        }
    }
    
    function activateUndoButton() {
        let undoButton = $("#menu img");
        undoButton.addClass("activated");
    }

    function deactivateUndoButton() {
        let undoButton = $("#menu img");
        undoButton.removeClass("activated");
    }
    
    //cover dimension and position of alerts if document is being scrolled when list is longer 
    function customCoverAndAlertPosition(cover, elem) { 
        let containerHeight = $(".container").outerHeight();
        let viewportHeight = window.innerHeight;
        if (containerHeight > viewportHeight)  {  
               cover.css("height", containerHeight + "px"); 
               
               let scrolling = $(window).scrollTop();
               let topPosition = viewportHeight / 2 + scrolling + "px";
               elem.css("top", topPosition);
        }
    }
    
    function openAlert(message) {
        $('#customisedAlert p').text(message);
        customCoverAndAlertPosition($cover2, $alertBox);
        $cover2.fadeTo(360, 0.5);
        $cover2.css({display: "block", "z-index": 100});
        $alertBox.fadeIn("slow", function() {
            $alertBox.css("display", "block");
        }); 
    }
    
    function closeAlert() {
        $cover2.fadeTo(360, 0);
        $cover2.css({display: "none", "z-index": ""});
        
        $alertBox.fadeOut("slow", function() {
            $alertBox.css("display", "none");     
        }); 
        $textArea.val($('.editMe').children("span").text()); 
    }
    
    function displayModal() {
        $editWindow.fadeIn("slow", function() {  
            $editWindow.css("display", "block");  
        });
    }
    
    function hideModal() {
        $editWindow.fadeOut("slow", function() { 
            $editWindow.css("display", "none");  
        });
    }
    
    function increaseTextarea(elem) {
        elem.css("height", "5px");
        elem.css("height", elem[0].scrollHeight + "px");
    }
    
    function closeModal() {
        hideModal();
        $cover1.css("display", "none");
        $(".editMe").removeClass("editMe"); 
    }
    
    // automatically deactivate up/down arrows after some inactivity
    function deactivateUpDownArrows() {
        return setTimeout(function() {
            $("#menu i").removeClass("activated", 1000);
        }, 1000 * 60);
    }
    
    function warn() {
        $itemToMove.removeClass("sort-item");
        $itemToMove.css("border", "2px solid orange").animate({"borderColor": "orange"}, "slow", function() {
            $itemToMove.css("border", "none");
        });
        let sound = new Audio("./assets/sounds/audio.wav");
        sound.play();
        return;
    }
    
    $('.add-items').submit( function(event) {
        event.preventDefault();
        let item = $('#todo-list-item').val().trim();
        if (item) {  
            let check;
            
            $list.children().each(function(index, elem) {             
                check = checkDuplicates(item, elem);
                    
                if (check) {
                    return false; // get out of the loop if duplicate!
                }
            });
                  
            if (check) {
                openAlert(`You have already added: "${item}". Please add a different item in your to do list!`);
                $('#todo-list-item').val("");
            }  else {
                $('#list-items').append("<li>" + itemTemplate(item) + "</li>");
                localStorage.setItem("listItems", $list.html());
                $("#todo-list-item").val("");               
            }
        } else {
            openAlert("Please add an item before submitting!");
            $("#todo-list-item").val("");
        }
    });
    
    $(document).on("change", ".checkbox", function() {
        
       if ($(this).attr("checked")) {
            $(this).removeAttr("checked");
        } else {  
            $(this).attr("checked", "checked");
        }

        $(this).parent().css("text-decoration", this.checked ? "line-through" : "none");
        localStorage.setItem("listItems", $list.html());
    })  
    

    $(document).on('click', 'div.functionality img', function() {
        $(this).toggleClass('important flag');
        $(this).parents().eq(1).removeClass("highlight");
        localStorage.setItem("listItems", $list.html());
    });
    

    $(document).on("click", ".remove", function() {
        let divParent = $(this).parent();
        
        divParent.parent().fadeOut('slow', function() {
            let $index = $(this).index();
            let $deletedItem = $(this).detach();
            $deletedItem.find("div.functionality i.fa-spin").removeClass("fa-spin");

            localStorage.setItem("listItems", $list.html());
            sessionStorage.setItem("deletedItem", $deletedItem.html());
            sessionStorage.setItem("indexOfDeletedItem", $index);
            activateUndoButton() ;
        });    
    });

    $("#menu img").click(function() {
        let item = sessionStorage.getItem("deletedItem");
        let index = sessionStorage.getItem("indexOfDeletedItem");
        
        if (item && index) {
            if (index == 0) { // double-equals because it is "0" in index! String from localStorage!
                $list.prepend(`<li>${item}</li>`);
            } else {
                let $elem = $("#list-items li").eq(index - 1);
                $elem.after(`<li>${item}</li>`);
            }
            localStorage.setItem("listItems", $list.html());
            sessionStorage.setItem("deletedItem", "");
            sessionStorage.setItem("indexOfDeletedItem", "");
            deactivateUndoButton();
        } else {
            openAlert("Ooops, no items to restore...");
        } 
    });
    
    $(document).on("click", ".edit", function() {
        let $cover1 = $(".cover").eq(0);
        customCoverAndAlertPosition($cover1, $editWindow);
        $cover1.fadeTo(360, 0.5);
        $cover1.css("display", "block");
        displayModal();
        
        $(this).parents().eq(1).addClass("editMe");
        let itemToEdit = $(this).parents().eq(1).text();
        let value = itemToEdit.replace("Edit...", "").trim(); 
        $textArea.val(value); 
        increaseTextarea($textArea);
    });
  
    $(document).on("click", ".edit-me-submit", function() {
            updateListItem();
        });   
    
    $(document).on("keyup", function(event) {
        if (event.which === 13 && $editWindow.is(":visible")) {
            updateListItem();
        }
    });

    $(document).on('click', "#ok", function() {
        closeAlert();
    });
    
    $(document).on("click", ".close-alert", function() {
        closeAlert();
    });

    $(document).on("click", ".cover:eq(1)", function() {
        closeAlert();
    });
    
    $(document).on("keydown keyup", function(event) {
        if (event.which === 27 && $alertBox.is(":visible")) {
            closeAlert(); 
        }        
     });
            
    $(document).on("click", ".close-modal", function() {
        closeModal();
    });
    
    $(document).on("click", ".cover:eq(0)", function() {
        closeModal();
    });
    
    $(document).on("keydown keyup", function(event) {
    if (event.which === 27 && $alertBox.is(':hidden')) {
        closeModal();   
    }        
    });  

    $list.sortable({
        axis: "y",
        revert: 180,
        placeholder: "sort-placeholder",
        start: function(event, ui) {
            ui.item.addClass("sort-item");
            let placeholderHeight = ui.item.outerHeight();
            ui.placeholder.height(placeholderHeight + 20);  
        },
        change: function(event, ui) {
            $(ui.placeholder).hide().slideDown("slow");
        },
        stop: function(event, ui) {
            ui.item.removeClass("sort-item");
            $list.children().removeClass("highlight");
            localStorage.setItem("listItems", $list.html());
        } 
    });
    
    $(document).on("click", $list, function(event) {
        if ($(event.target).prop("tagName").toLowerCase() === "span") {                
                $ind = $(event.target).parent().index();
                $itemToMove = $list.children().eq($ind);
                $itemToMove.toggleClass("sort-item");
                
                $(document.body).click(function(event) {
                    let target = $(event.target);
                    if (target.is($itemToMove) || target.parents().is($itemToMove)) {
                        return;
                    } else {
                        $itemToMove.removeClass("sort-item");
                    }
                });
                 
                let $arrows = $("#menu i");
                $arrows.addClass("activated");

                if (! $list.children().hasClass("sort-item")) {
                    $arrows.removeClass("activated");
                    $itemToMove.removeClass("highlight");
                    localStorage.setItem("listItems", $list.html())
                }
        }  
    });
    
    $(document).on("click", ".fa-chevron-circle-down.activated", function() {
        clearTimeout(timer);
        let $currentInd = $itemToMove.index(); 
        if ($currentInd === $list.children().length - 1) {
            warn();
        } else {
            if (!$itemToMove.hasClass("sort-item")) $itemToMove.addClass("sort-item");
           
            $itemToMove.insertAfter($itemToMove.next()).fadeIn(600, function() {
                $itemToMove.removeClass("sort-item", 800);
            });
            setTimeout(function() {localStorage.setItem("listItems", $list.html())}, 1400);
        }
        timer = deactivateUpDownArrows();
    });
    
    $(document).on("click", ".fa-chevron-circle-up.activated", function() {
        clearTimeout(timer);
        let $currentInd = $itemToMove.index();
        if ($currentInd === 0) {
            warn();
        } else {
            if (!$itemToMove.hasClass("sort-item")) $itemToMove.addClass("sort-item");
            
            $itemToMove.insertBefore($itemToMove.prev()).fadeIn(600, function() {
                $itemToMove.removeClass("sort-item", 800);
            });
            setTimeout(function() {localStorage.setItem("listItems", $list.html())}, 1400);
        }
        timer = deactivateUpDownArrows(); 
    });
    
    
});