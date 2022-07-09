/* 

Here is your key: ad74095d

Please append it to all of your API requests,

OMDb API: http://www.omdbapi.com/?i=tt3896198&apikey=ad74095d

---

TODO:
1. Extract components: Movie component, Input component
2. Make fetch request modular, see Altcademy
3. Clean up layout: 
- Movie poster and description overlap. --> Two movies in a row should apply from xl breakpoint, not from lg. 
- Add styling to title. 
- Change font
- Add info on OMDB API at bottom of page

----

RE-READ:
Promises and how they work, chaining promises
Controlled components: Why do I have to take the input of input fields, pass it to state and then to the field again? What's the point? What are controlled components exaclty? Where do I get the value of a field from?
-----
WHAT I LEARNED
onSubmit works on a form element, not on a button. On a button, use onClick. (This is a feature of JS, not just React. The handlers are named onsubmit and onclick in JS.)

See:
URL: https://developer.mozilla.org/en-US/docs/Web/API/GlobalEventHandlers/onsubmit
"The submit event fires when the user submits a form."

"The click event is raised when the user clicks on an element. It fires after the mousedown and mouseup events, in that order."
URL: https://developer.mozilla.org/en-US/docs/Web/API/GlobalEventHandlers/onclick


-----
Component Hierarchy:
MovieFinder --> STATE LIVES HERE
  - SearchMovie: renders input based on user input
  - MovieResults: renders search results based on user input
---

Minimal but complete representation of UI state
Pieces of data:
Movie database // not part of this app
User input // STATE
Displayed results // Computed based on user input -> not state // REVISED: David adds movie results to state, as well.
*/

/* 
 MovieInput component

 TASK:
 Show user input
 Change state with user input
 Submit user input
 Make fetch request
 Change state with movies received

*/

function Movies(props) {
  let {movies} = props;

  return (
    <div className="row mt-5">
      {movies.map(movie => {
        let {Poster, Title, Type, Year, imdbID} = movie;
          return (
            <div className="individual-movie col-xs-12 col-lg-6 mb-5 pe-lg-1" key={imdbID}>
              <div className="row">
                <div className="movie-poster-wrapper col-xs-12 col-sm-6">
                  {/* movie poster */}
                  <a href={`https://www.imdb.com/title/${imdbID}/`} target="_blank">
                    <img className="movie-poster d-block mx-auto" src={Poster} alt="" />
                  </a>
                </div>
                <div className="movie-description col-xs-12 col-sm-6">
                  {/* movie description */}
                  <p className="movie-title">Title: <a href={`https://www.imdb.com/title/${imdbID}/`} target="_blank">{Title}</a></p>
                  <p className="movie-year-type">{Type[0].toUpperCase() + Type.slice(1)} &#124; {Year}</p>
                </div>
              </div>
            </div>
          );
        }
      )}
    </div>
  );
}

class MovieFinder extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      searchTerm: '',
      movieList: [],
      error: '',
    };

    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }


  handleInputChange() {
    this.setState({searchTerm: event.target.value});
  }

  // handle submit
  handleSubmit() {
    // Without event.preventDefault(), page is re-rendered
    event.preventDefault();
    let {searchTerm} = this.state;
    /* 
    If this.state.searchTerm === ''
      Return null
    */
    // Remove spaces at start and end of user input. If nothing left, ie if input is empty string, return null
    if (!searchTerm.trim()) {
      // Reset searchTerm and input field to ''
      this.setState({searchTerm: ''});
      return;
    }

    fetch(`http://www.omdbapi.com/?apikey=ad74095d&s=${this.state.searchTerm}`).then((response) => {
      if (response.ok) {
        // .ok returns true if response status is 200-299
        // Note that despite the method being named json(), the result is not JSON but is instead the result of taking JSON as input and parsing it to produce a JavaScript object.
        // URL: https://developer.mozilla.org/en-US/docs/Web/API/Response/json
        return response.json();
      }
      throw new Error('Request was either a 404 or 500');
    }).then((data) => {
      if (data.Response === 'False') {
        throw new Error(data.Error);
      }

      this.setState({
        movieList: data.Search,
        error: '',
      });
    }).catch((error) => {
      this.setState({error: error.message});
    });

    this.setState({searchTerm: ''});
    /* 
    make fetch request
    get data from fetch request
    turn it into js object
    set state to reflect data */
  }


  render() {
    // What will be the value inside .movie-search?
    // The alt value inside each movie result?

    let {searchTerm, movieList, error} = this.state;

    return(
      <div className="movie-finder container-fluid">
        <div className="row mt-3">
          <div className="col-12">
            <h1>Movie Finder</h1>
             {/* Search bar */}
            <form className="row justify-content-start mt-4">
              <div className="col-0">
                {/* Label is necessary for accessability, but I hid it because it looks better that way */}
                <label htmlFor="movie-search" className="visually-hidden">Movie Search: </label>
              </div>
              <div className="col-auto">
                <input type="text" className="movie-search form-control" id="movie-search" aria-describedby="movie-search-help" value={searchTerm} onChange={this.handleInputChange} />
                <div className="form-text" id="movie-search-help">Search movie by title.</div>
              </div>
              <div className="col-auto">
                <button type="submit" className="btn btn-primary" onClick={this.handleSubmit}>Search</button>
              </div>
            </form>
          </div>
        </div>
  
        <div className="row movie-results mt-4">
          <div className="col-12">
            <h2>Results</h2>
              {error ? <p className="col-12">{error}</p> : 
              <Movies movies={movieList} />}
              {/* {error ? <p className="col-12">{error}</p> : 
              movieList.map(movie => {
                let {Poster, Title, Type, Year, imdbID} = movie;
                  return (
                    <div className="individual-movie col-xs-12 col-lg-6 mb-5 pe-lg-1" key={imdbID}>
                      <div className="row">
                        <div className="movie-poster-wrapper col-xs-12 col-sm-6">
                          <a href={`https://www.imdb.com/title/${imdbID}/`} target="_blank">
                            <img className="movie-poster d-block mx-auto" src={Poster} alt="" />
                          </a>
                        </div>
                        <div className="movie-description col-xs-12 col-sm-6">
                          <p className="movie-title">Title: <a href={`https://www.imdb.com/title/${imdbID}/`} target="_blank">{Title}</a></p>
                          <p className="movie-year-type">{Type[0].toUpperCase() + Type.slice(1)} &#124; {Year}</p>
                        </div>
                      </div>
                    </div>
                  );
                }
              )} */}


              {/* <div className="individual-movie col-xs-12 col-lg-6 mb-5 pe-lg-1">
                <div className="row">
                  <div className="movie-poster-wrapper col-xs-12 col-sm-6">
                    
                    <img className="movie-poster d-block mx-auto" src="https://picsum.photos/200/300" alt="" />
                  </div>
                  <div className="movie-description col-xs-12 col-sm-6">
            
                    <p className="movie-title">Title: Frozen</p>
                    <p className="movie-year">Year: 2013</p>
                    <p className="movie-director">Director: John Doe</p>
                    <p className="movie-cast">Cast: Jane Doe, John Smith, Amanda Doe-Smith</p>
                    <p className="movie-genre">Genre: Comedy</p>
                    <p className="movie-plot">Plot: Lorem ipsum dolor sit amet consectetur adipisicing elit. Mollitia dolores ea pariatur vel asperiores rem porro, aliquam similique doloribus aliquid sunt? Blanditiis accusantium laudantium delectus. Blanditiis repellat harum ad atque recusandae voluptatum, nam maxime sequi praesentium saepe vel veritatis aliquam id qui ab nesciunt impedit quos eos laboriosam esse? Similique!.</p>
                    <p className="movie-rating">10/10</p>
                  </div>
                </div>
              </div> */}
            {/* </div> */}
          </div>
        </div>
      </div>
    );

  }
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<MovieFinder />);

