; This is a comment. It just stays where it is.

; We can have literals of various types
42   ; number
"hello"   ; string
#\m    ; character
#t     ; boolean
quuz   ; symbol

; we can define a variable or two
(define FIRST-NAME "John")
(define LAST-NAME "Doe")

; we can have structures
(define-struct person (first-name last-name age country))

; which we can then make instances of
(define john (make-person FIRST-NAME LAST-NAME 28 "USA"))

; we can define functions
(define (years-to-seconds years) (* years 360 24 60 60))

(define (greet p)
  (format "Hello ~a from ~a. You've been alive for ~a seconds."
          (person-first-name p)
          (person-country p)
          (years-to-seconds (person-age p))))

; and we can call functions
(greet john)

; we can also evaluate boolean expressions
(and #t #f)
(or #t #f)