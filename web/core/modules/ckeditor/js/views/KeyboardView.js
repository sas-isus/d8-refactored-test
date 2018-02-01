/**
* DO NOT EDIT THIS FILE.
* See the following change record for more information,
* https://www.drupal.org/node/2815083
* @preserve
**/

(function ($, Drupal, Backbone, _) {
  Drupal.ckeditor.KeyboardView = Backbone.View.extend({
    initialize: function initialize() {
      this.$el.on('keydown.ckeditor', '.ckeditor-buttons a, .ckeditor-multiple-buttons a', this.onPressButton.bind(this));
      this.$el.on('keydown.ckeditor', '[data-drupal-ckeditor-type="group"]', this.onPressGroup.bind(this));
    },
    render: function render() {},
    onPressButton: function onPressButton(event) {
      var upDownKeys = [38, 63232, 40, 63233];
      var leftRightKeys = [37, 63234, 39, 63235];

      if (event.keyCode === 13) {
        event.stopPropagation();
      }

      if (_.indexOf(_.union(upDownKeys, leftRightKeys), event.keyCode) > -1) {
        var view = this;
        var $target = $(event.currentTarget);
        var $button = $target.parent();
        var $container = $button.parent();
        var $group = $button.closest('.ckeditor-toolbar-group');
        var $row = void 0;
        var containerType = $container.data('drupal-ckeditor-button-sorting');
        var $availableButtons = this.$el.find('[data-drupal-ckeditor-button-sorting="source"]');
        var $activeButtons = this.$el.find('.ckeditor-toolbar-active');

        var $originalGroup = $group;
        var dir = void 0;

        if (containerType === 'source') {
          if (_.indexOf([40, 63233], event.keyCode) > -1) {
            $activeButtons.find('.ckeditor-toolbar-group-buttons').eq(0).prepend($button);
          }
        } else if (containerType === 'target') {
          if (_.indexOf(leftRightKeys, event.keyCode) > -1) {
            var $siblings = $container.children();
            var index = $siblings.index($button);
            if (_.indexOf([37, 63234], event.keyCode) > -1) {
              if (index > 0) {
                $button.insertBefore($container.children().eq(index - 1));
              } else {
                  $group = $container.parent().prev();
                  if ($group.length > 0) {
                    $group.find('.ckeditor-toolbar-group-buttons').append($button);
                  } else {
                      $container.closest('.ckeditor-row').prev().find('.ckeditor-toolbar-group').not('.placeholder').find('.ckeditor-toolbar-group-buttons').eq(-1).append($button);
                    }
                }
            } else if (_.indexOf([39, 63235], event.keyCode) > -1) {
                if (index < $siblings.length - 1) {
                  $button.insertAfter($container.children().eq(index + 1));
                } else {
                    $container.parent().next().find('.ckeditor-toolbar-group-buttons').prepend($button);
                  }
              }
          } else if (_.indexOf(upDownKeys, event.keyCode) > -1) {
              dir = _.indexOf([38, 63232], event.keyCode) > -1 ? 'prev' : 'next';
              $row = $container.closest('.ckeditor-row')[dir]();

              if (dir === 'prev' && $row.length === 0) {
                if ($button.data('drupal-ckeditor-type') === 'separator') {
                  $button.off().remove();

                  $activeButtons.find('.ckeditor-toolbar-group-buttons').eq(0).children().eq(0).children().trigger('focus');
                } else {
                    $availableButtons.prepend($button);
                  }
              } else {
                $row.find('.ckeditor-toolbar-group-buttons').eq(0).prepend($button);
              }
            }
        } else if (containerType === 'dividers') {
            if (_.indexOf([40, 63233], event.keyCode) > -1) {
              $button = $button.clone(true);
              $activeButtons.find('.ckeditor-toolbar-group-buttons').eq(0).prepend($button);
              $target = $button.children();
            }
          }

        view = this;

        Drupal.ckeditor.registerButtonMove(this, $button, function (result) {
          if (!result && $originalGroup) {
            $originalGroup.find('.ckeditor-buttons').append($button);
          } else {
              view.$el.find('.ui-sortable').sortable('refresh');
            }

          $target.trigger('focus');
        });

        event.preventDefault();
        event.stopPropagation();
      }
    },
    onPressGroup: function onPressGroup(event) {
      var upDownKeys = [38, 63232, 40, 63233];
      var leftRightKeys = [37, 63234, 39, 63235];

      if (event.keyCode === 13) {
        var view = this;

        window.setTimeout(function () {
          Drupal.ckeditor.openGroupNameDialog(view, $(event.currentTarget));
        }, 0);
        event.preventDefault();
        event.stopPropagation();
      }

      if (_.indexOf(_.union(upDownKeys, leftRightKeys), event.keyCode) > -1) {
        var $group = $(event.currentTarget);
        var $container = $group.parent();
        var $siblings = $container.children();
        var index = void 0;
        var dir = void 0;

        if (_.indexOf(leftRightKeys, event.keyCode) > -1) {
          index = $siblings.index($group);

          if (_.indexOf([37, 63234], event.keyCode) > -1) {
            if (index > 0) {
              $group.insertBefore($siblings.eq(index - 1));
            } else {
                $group.insertBefore($container.closest('.ckeditor-row').prev().find('.ckeditor-toolbar-groups').children().eq(-1));
              }
          } else if (_.indexOf([39, 63235], event.keyCode) > -1) {
              if (!$siblings.eq(index + 1).hasClass('placeholder')) {
                $group.insertAfter($container.children().eq(index + 1));
              } else {
                  $container.closest('.ckeditor-row').next().find('.ckeditor-toolbar-groups').prepend($group);
                }
            }
        } else if (_.indexOf(upDownKeys, event.keyCode) > -1) {
            dir = _.indexOf([38, 63232], event.keyCode) > -1 ? 'prev' : 'next';
            $group.closest('.ckeditor-row')[dir]().find('.ckeditor-toolbar-groups').eq(0).prepend($group);
          }

        Drupal.ckeditor.registerGroupMove(this, $group);
        $group.trigger('focus');
        event.preventDefault();
        event.stopPropagation();
      }
    }
  });
})(jQuery, Drupal, Backbone, _);