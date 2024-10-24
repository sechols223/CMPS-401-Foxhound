package main;

type HttpStatusCode int;

const (
  Ok            HttpStatusCode = 200
  NotFound      HttpStatusCode = 404
  BadRequest    HttpStatusCode = 400
  UnkownError   HttpStatusCode = 500
)

type ResponseError struct {
  Message       string  `json:"message"`
  PropertyName  string  `json:"propertyName"`
}

type Response struct {
  Data          interface{}     `json:"data"`
  StatusCode    HttpStatusCode  `json:"statusCode"`
} 

var HttpStatusCodes = struct {
  Ok            HttpStatusCode
  NotFound      HttpStatusCode
  BadRequest    HttpStatusCode
  UnknownError  HttpStatusCode
}{
  Ok: Ok,
  NotFound: NotFound,
  BadRequest: BadRequest,
  UnknownError: UnkownError,
}
