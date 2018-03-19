$(document).ready(function() {
    let spinMe = elem => {
        $(document).on("mouseenter mouseleave", elem, function() {
            $(this).children().toggleClass('fa-spin');
        });
    };

    spinMe(".remove");
    spinMe(".close-modal");
    spinMe(".close-alert");  

    let highlightEditButton = (event, effect) => {
        $(document).on(event, ".edit", function() {
            $(this).css("font-weight", effect);
        });
    }

    highlightEditButton("mouseenter", "bold");
    highlightEditButton("mouseleave", "normal");

    $(document).on("mouseenter", "li", function() {
        $(this).addClass("highlight");
    });

    $(document).on("mouseleave", "li", function() {
        $(this).removeClass("highlight");
    });

    $(document).on("mouseenter", "li", function() {
        $(this).children('.checkbox').css("cursor", "pointer");
    });
    
    $("#menu img").hover(function() {
        $(this).addClass("hovered");
    }, function() {
        $(this).removeClass("hovered");
    });

    $("#menu i").hover (function() {
        $(this).addClass("hovered");
    }, function() {
        $(this).removeClass("hovered");
    });
});  
    
    



