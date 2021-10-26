package mail

type Service interface {
	CreateMail(mailReq *Mail) []byte
	SendMail(mailReq *Mail) error
}

type Type int

// List of Mail Types we are going to send.
const (
	TypeConfirmation Type = iota + 1
	TypePassReset
)

// Data represents the data to be sent to the template of the mail.
type Data struct {
	VerifyURL string
}

// Mail represents a email request
type Mail struct {
	From    string
	To      []string
	Subject string
	Body    string
	MType   Type
	Data    *Data
}
