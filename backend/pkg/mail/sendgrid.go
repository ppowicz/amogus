package mail

import (
	"errors"
	"fmt"
	"github.com/sendgrid/sendgrid-go"
	"github.com/sendgrid/sendgrid-go/helpers/mail"
	"pizzeria/pkg/config"
)

type SGMailService struct {
	conf *config.Config
}

// NewSGMailService returns a new instance of SGMailService
func NewSGMailService(conf *config.Config) *SGMailService {
	return &SGMailService{conf}
}

// CreateMail takes in a mail request and constructs a sendgrid mail type.
func (ms *SGMailService) CreateMail(mailReq *Mail) []byte {
	m := mail.NewV3Mail()

	from := mail.NewEmail(ms.conf.MailSenderName, ms.conf.MailSenderEmail)
	m.SetFrom(from)

	if mailReq.MType == TypeConfirmation {
		m.SetTemplateID(ms.conf.MailVerifyTemplateID)
	} else if mailReq.MType == TypePassReset {
		// m.SetTemplateID(ms.conf.PassResetTemplateID)
		// todo
	}

	p := mail.NewPersonalization()

	tos := make([]*mail.Email, 0)
	for _, to := range mailReq.To {
		tos = append(tos, mail.NewEmail("user", to))
	}

	p.AddTos(tos...)

	p.SetDynamicTemplateData("verify_url", mailReq.Data.VerifyURL)

	m.AddPersonalizations(p)
	return mail.GetRequestBody(m)
}

// SendMail creates a sendgrid mail from the given mail request and sends it.
func (ms *SGMailService) SendMail(mailReq *Mail) error {
	request := sendgrid.GetRequest(ms.conf.SendgridApiKey, "/v3/mail/send", "https://api.sendgrid.com")
	request.Method = "POST"
	var Body = ms.CreateMail(mailReq)
	request.Body = Body
	response, err := sendgrid.API(request)
	if err != nil {
		fmt.Printf("unable to send mail: %v\n", err)
		return err
	}

	if response.StatusCode < 200 || response.StatusCode > 299 {
		return errors.New(response.Body)
	}

	fmt.Println(response.Body)
	fmt.Printf("mail sent successfully - status code: %v\n", response.StatusCode)
	return nil
}
