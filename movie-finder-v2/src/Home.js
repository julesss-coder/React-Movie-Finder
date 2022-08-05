import React from 'react';
import { Link } from "react-router-dom";
import { json, checkStatus } from './utils';


/* ==== MOVIE INPUT COMPONENT ==== */
function MovieInput(props) {
  let {searchTerm, handleChange, handleSubmit} = props;

  return (
    <form className="row justify-content-start mt-4">
      <div className="col-0">
        {/* Label is necessary for accessability, but I hid it because it looks better that way */}
        <label htmlFor="movie-search" className="visually-hidden">Movie Search: </label>
      </div>
      <div className="col-auto">
        <input type="text" className="movie-search form-control" id="movie-search" aria-describedby="movie-search-help" value={searchTerm} onChange={handleChange} />
        <div className="form-text" id="movie-search-help">Search movie by title.</div>
      </div>
      <div className="col-auto">
        <button type="submit" className="btn btn-primary" onClick={handleSubmit}>Search</button>
      </div>
    </form>
  )
}

/* ==== MOVIES COMPONENT ==== */
function Movies(props) {
  let {movies} = props;

  return (
    <div className="row mt-5">
      {movies.map(movie => {
        let {Poster, Title, Type, Year, imdbID} = movie;
          return (
            <div className="individual-movie col-12 col-xl-6 mb-5 pe-lg-1" key={imdbID}>
              <div className="row">
                <div className="movie-poster-wrapper col-12 col-sm-7">
                  {/* movie poster */}
                  {/* Linking to the movie page only worked when I added the line below instead of the one underneath it */}
                  <Link to={`/movie/${imdbID}/`} target="_blank">
                  {/* <Link to={`https://www.imdb.com/title/${imdbID}/`} target="_blank"> */}
                    <img className="movie-poster d-block mx-auto" src={Poster} alt={`Movie poster for ${Title}`} />
                  </Link>
                </div>
                <div className="movie-description col-10 offset-2 col-sm-5 offset-sm-0 p-3">
                  {/* movie description */}
                  <p className="movie-title fs-4">
                    Title:&nbsp;
                    <Link to={`/movie/${imdbID}/`} target="_blank">{Title}</Link> 
                  {/* <Link to={`https://www.imdb.com/title/${imdbID}/`} target="_blank">{Title}</Link> */}
                  </p>
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

/* ==== PARENT COMPONENT MOVIEFINDER ==== */
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


  handleInputChange(e) {
    this.setState({searchTerm: e.target.value});
  }

  handleSubmit(e) {
    // Without event.preventDefault(), page is re-rendered
    e.preventDefault();
    let {searchTerm} = this.state;

    // Remove spaces at start and end of user input. If nothing left, ie if input is empty string, return early
    if (!searchTerm.trim()) {
      // Reset searchTerm and input field to ''
      this.setState({searchTerm: ''});
      return;
    }

    fetch(`https://www.omdbapi.com/?apikey=ad74095d&s=${this.state.searchTerm}`)
      .then(checkStatus)
      .then(json)
      .then(data => {
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
  }


  render() {
    let {searchTerm, movieList, error} = this.state;

    return(
      <div className="movie-finder container-fluid">
        <div className="row mt-3">
          <div className="col-12">
            {/* Checking to see if I can add Home link here instead of App.js. WORKS */}
            <Link className="link-dark" to="/">
              <h1>Movie Finder</h1>
            </Link>
            {/* Movie Input Component */}
            <MovieInput searchTerm={searchTerm} handleChange={(e) => this.handleInputChange(e)} handleSubmit={(e) => this.handleSubmit(e)}/> 
          </div>
        </div>
  
        <div className="row movie-results mt-4">
          <div className="col-12">
            <h2>Results</h2>
            <small>Results from <a href="https://www.omdbapi.com/" target="_blank">OMDb API - The Open Movie Database</a>.</small>
              {/* Error, or Movies Component */}
              {error ? <p className="col-12">{error}</p> : 
              <Movies movies={movieList} />}
              
          </div>
        </div>
      </div>
    );
  }
}

export default MovieFinder;