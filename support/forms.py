from django import forms
from .models import SupportTicket, SupportMessage


class SupportTicketForm(forms.ModelForm):
    message = forms.CharField(
        label="Сообщение",
        widget=forms.Textarea(attrs={'class': 'form-control', 'rows': 5}),
        required=True
    )

    class Meta:
        model = SupportTicket
        fields = ['category']

        widgets = {
            'category': forms.Select(attrs={'class': 'form-select'}),
        }
        labels = {
            'category': 'Категория',
        }


class SupportMessageForm(forms.ModelForm):
    class Meta:
        model = SupportMessage
        fields = ['message']
        widgets = {
            'message': forms.Textarea(
                attrs={'class': 'form-control', 'rows': 3}),
        }
        labels = {
            'message': 'Ваше сообщение',
        }
