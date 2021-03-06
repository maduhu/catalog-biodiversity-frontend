define([], function() {
	return ['$scope', '$routeParams', '$location', '$http', 'Catalogue', 'SearchOptions', function($scope, $routeParams, $location, $http, Catalogue, SearchOptions) {
		// You can access the scope of the controller from here
		SearchOptions.setCurrentTaxon("fungi");
		SearchOptions.setCurrentLocation($location.$$path);
		if($routeParams.priorityImages == 'false') {
			SearchOptions.setShowRecordsWithPicture(false);
		} else {
			SearchOptions.setShowRecordsWithPicture(true);
		}
		if($routeParams.order == 'desc') {
			SearchOptions.setOrderDirection('desc');
		} else {
			SearchOptions.setOrderDirection('asc');
		}
		if(typeof $routeParams.q != 'undefined') {
			SearchOptions.setSearchCondition($routeParams.q);
		} else {
			SearchOptions.setSearchCondition("");
		}
		$scope.catalogue = new Catalogue(SearchOptions);
		$scope.Math = window.Math;

		// because this has happened asynchroneusly we've missed
		// Angular's initial call to $apply after the controller has been loaded
		// hence we need to explicityly call it at the end of our Controller constructor
		$scope.$apply();

		$.Isotope.prototype._getCenteredMasonryColumns = function() {
			this.width = this.element.width();

			var parentWidth = this.element.parent().width();

			// i.e. options.masonry && options.masonry.columnWidth
			var colW = this.options.masonry && this.options.masonry.columnWidth ||
				// or use the size of the first item
				this.$filteredAtoms.outerWidth(true) ||
				// if there's no items, use size of container
				parentWidth;

			var cols = Math.floor( parentWidth / colW );
			cols = Math.max( cols, 1 );

			// i.e. this.masonry.cols = ....
			this.masonry.cols = cols;
			// i.e. this.masonry.columnWidth = ...
			this.masonry.columnWidth = colW;
		};
		  
		$.Isotope.prototype._masonryReset = function() {
			// layout-specific props
			this.masonry = {};
			// FIXME shouldn't have to call this again
			this._getCenteredMasonryColumns();
			var i = this.masonry.cols;
			this.masonry.colYs = [];
			while (i--) {
				this.masonry.colYs.push( 0 );
			}
		};

		$.Isotope.prototype._masonryResizeChanged = function() {
			var prevColCount = this.masonry.cols;
			// get updated colCount
			this._getCenteredMasonryColumns();
			return ( this.masonry.cols !== prevColCount );
		};
		  
		$.Isotope.prototype._masonryGetContainerSize = function() {
			var unusedCols = 0,
			i = this.masonry.cols;
			// count unused columns
			while ( --i ) {
				if ( this.masonry.colYs[i] !== 0 ) {
					break;
				}
				unusedCols++;
			}
			return {
				height : Math.max.apply( Math, this.masonry.colYs ),
				// fit container to columns that have been used;
				width : (this.masonry.cols - unusedCols) * this.masonry.columnWidth
			};
		};
	}];
});