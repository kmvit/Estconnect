from django.contrib import admin
from .models import SupportTicket, SupportMessage

class SupportMessageInline(admin.TabularInline):
    model = SupportMessage
    extra = 0

@admin.register(SupportTicket)
class SupportTicketAdmin(admin.ModelAdmin):
    list_display = ('title', 'creator', 'manager', 'status', 'created_at', 'updated_at')
    list_filter = ('status',)
    search_fields = ('title', 'creator__username', 'manager__username')
    inlines = [SupportMessageInline]
