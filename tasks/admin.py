from django.contrib import admin
from .models import Role, User, Status, Priority, Ticket, Comment, ActivityLog

admin.site.register(Role)
admin.site.register(User)
admin.site.register(Status)
admin.site.register(Priority)
admin.site.register(Ticket)
admin.site.register(Comment)
admin.site.register(ActivityLog)




